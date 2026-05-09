import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import axios from 'axios';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSy_YOUR_MOCK_KEY");
const META_VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || "whatsaicrm_secure_token_2026";
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || "mock_meta_access_token";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const server = createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

let waSocket: any = null;
let connectionStatus = 'انتظار الربط';
let lastQrCode = ''; 
let liveMetrics = { totalToday: 0, perMinute: 0, activeUsers: 0 };

const recentMessages: any[] = [];
const systemLogs: any[] = []; // for the frontend Logs button

// MOCK DATABASE FOR BOT
const products = [
    { id: 1, name: "لابتوب ألعاب (Gaming Laptop)", specs: "RTX 4060, 16GB RAM, 512GB SSD", price: "4000 ريال", stock: 5 },
    { id: 2, name: "آيفون 15 برو", specs: "256GB, تيتانيوم طبيعي", price: "4500 ريال", stock: 10 },
    { id: 3, name: "سماعات سوني WH-1000XM5", specs: "عزل ضوضاء ممتاز، بطارية 30 ساعة", price: "1200 ريال", stock: 20 },
];

const chatSessions: Record<string, { history: string[], orderState: string }> = {};

function addLog(type: string, message: string) {
    const time = new Date().toLocaleTimeString('ar-EG');
    systemLogs.unshift({ time, type, message });
    if (systemLogs.length > 50) systemLogs.pop();
    io.emit('new_log', systemLogs);
}

setInterval(() => {
    liveMetrics.perMinute = Math.max(0, liveMetrics.perMinute - 1);
    io.emit('metrics_update', liveMetrics);
}, 60000);

async function handleIncomingMessage(platform: string, fromId: string, pushName: string, text: string, replyCallback: (replyText: string) => Promise<void>) {
    addLog('USER', `رسالة عبر ${platform} من ${pushName}: ${text}`);
    liveMetrics.totalToday++;
    liveMetrics.perMinute++;
    
    // Session Management
    if (!chatSessions[fromId]) chatSessions[fromId] = { history: [], orderState: 'NONE' };
    const session = chatSessions[fromId];
    
    session.history.push(`العميل: ${text}`);
    if (session.history.length > 8) session.history.shift();

    const productListText = products.map(p => `- *${p.name}* (${p.specs})\n💰 السعر: ${p.price}`).join('\n\n');
    const isAdmin = fromId.includes('201020118437') || fromId.includes('201026672074');
    
    let systemPrompt = "";
    if (isAdmin) {
        systemPrompt = `أنت المساعد الذكي لإدارة نظام WhatsAI CRM.
أنت تتحدث الآن مع **المدير / الآدمن** (صاحب الصلاحيات العليا).
المهمة:
1. تنفيذ أوامر المدير.
2. إذا طلب المدير ملخص المبيعات، أخبره أن النظام يعمل بكفاءة وأنه تم استلام ${liveMetrics.totalToday} رسالة اليوم عبر المنصات.
3. كن عملياً ومباشراً.`;
    } else {
        systemPrompt = `أنت مساعد مبيعات احترافي جداً لمتجر (WhatsAI Market).
أنت تتحدث مع العميل عبر ${platform}.
**قواعد الرد:**
1. **الترحيب**: رحب بالعميل بحفاوة.
2. **عرض المنتجات**: اعرض المنتجات بوضوح.
3. **الحجز**: خذ (الاسم الثنائي، العنوان، ورقم للتواصل).
4. **تأكيد الأوردر**: في حال أخذ البيانات أصدر الفاتورة.
تاريخ المحادثة الأخير مع العميل لمعرفة السياق:
${session.history.join('\n')}

قم بالرد نيابة عن المتجر برد قصير، لطيف، واحترافي وباللغة العربية.`;
    }

    let aiReply = "";
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(systemPrompt);
        aiReply = result.response.text().replace(/\*\*/g, '*');
    } catch (error: any) {
        console.error('Gemini Error:', error.message);
        aiReply = "مرحباً بك! نأسف ولكن نظام الذكاء الاصطناعي يخضع لتحديث سريع، سيتم الرد عليك في غضون دقائق.";
        addLog('ERROR', 'فشل الذكاء الاصطناعي في الرد');
    }

    session.history.push(`أنت: ${aiReply}`);
    addLog('AI', `رد البوت عبر ${platform} على ${pushName}`);

    recentMessages.unshift({
        from: pushName,
        number: fromId,
        message: text,
        time: new Date().toLocaleTimeString('ar-EG'),
        ai: true,
        aiResponse: aiReply,
        platform: platform
    });
    if (recentMessages.length > 10) recentMessages.pop();

    io.emit('new_message', recentMessages);
    io.emit('metrics_update', liveMetrics);

    await replyCallback(aiReply);
}

// META WEBHOOKS (FACEBOOK/INSTAGRAM)
app.get('/webhook/meta', (req: Request, res: Response) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === META_VERIFY_TOKEN) {
            addLog('SUCCESS', 'تم توثيق Webhook الخاص بـ Meta (Facebook/Instagram) بنجاح');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(400);
    }
});

app.post('/webhook/meta', async (req: Request, res: Response) => {
    const body = req.body;
    if (body.object === 'page' || body.object === 'instagram') {
        res.status(200).send('EVENT_RECEIVED');
        for (const entry of body.entry) {
            if (!entry.messaging) continue;
            for (const webhookEvent of entry.messaging) {
                if (webhookEvent.message && webhookEvent.message.text) {
                    const senderId = webhookEvent.sender.id;
                    const text = webhookEvent.message.text;
                    const platform = body.object === 'instagram' ? 'Instagram' : 'Messenger';
                    
                    await handleIncomingMessage(platform, senderId, senderId, text, async (replyText) => {
                        // Send reply via Meta Graph API
                        try {
                            const url = `https://graph.facebook.com/v19.0/me/messages?access_token=${META_ACCESS_TOKEN}`;
                            await axios.post(url, {
                                recipient: { id: senderId },
                                message: { text: replyText }
                            });
                        } catch (err: any) {
                            addLog('ERROR', `فشل إرسال رسالة ${platform}: ${err.message}`);
                        }
                    });
                }
            }
        }
    } else {
        res.sendStatus(404);
    }
});

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    
    waSocket = makeWASocket({
        printQRInTerminal: false,
        auth: state,
        browser: ['WhatsAI Server', 'Chrome', '1.0']
    });

    waSocket.ev.on('creds.update', saveCreds);

    waSocket.ev.on('connection.update', (update: any) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            addLog('SYSTEM', 'تم إنشاء QR Code جديد بانتظار مسحه');
            lastQrCode = qr;
            connectionStatus = 'مسح الرمز (QR Code) مطلوب';
            io.emit('wa_qr', qr);
            io.emit('wa_status', { status: connectionStatus });
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut;
            addLog('WARNING', `انقطع الاتصال. إعادة المحاولة: ${shouldReconnect}`);
            connectionStatus = 'مغلق';
            lastQrCode = '';
            io.emit('wa_status', { status: connectionStatus });
            if (shouldReconnect) connectToWhatsApp();
        } else if (connection === 'open') {
            addLog('SUCCESS', 'تم ربط الواتساب بنجاح! البوت جاهز للعمل');
            connectionStatus = 'متصل';
            lastQrCode = '';
            liveMetrics.activeUsers = 1;
            io.emit('wa_status', { status: connectionStatus });
            io.emit('metrics_update', liveMetrics);
        }
    });

    waSocket.ev.on('messages.upsert', async (m: any) => {
        if (m.type === 'notify') {
            for (const msg of m.messages) {
                if (!msg.key.fromMe && msg.message) {
                    const from = msg.key.remoteJid!;
                    const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
                    if (!text) continue;

                    const pushName = msg.pushName || from.split('@')[0];
                    
                    await handleIncomingMessage('WhatsApp', from, pushName, text, async (replyText) => {
                        if (waSocket) await waSocket.sendMessage(from, { text: replyText });
                    });
                }
            }
        }
    });
}

io.on('connection', (socket) => {
    socket.emit('wa_status', { status: connectionStatus });
    if (lastQrCode) socket.emit('wa_qr', lastQrCode);
    socket.emit('metrics_update', liveMetrics);
    socket.emit('new_message', recentMessages);
    socket.emit('new_log', systemLogs);

    socket.on('request_qr', () => {
        if (connectionStatus !== 'متصل') {
            if (lastQrCode) socket.emit('wa_qr', lastQrCode);
            else if (!waSocket) connectToWhatsApp();
        }
    });

    socket.on('logout', async () => {
        try {
            if (waSocket) {
                await waSocket.logout();
                waSocket = null;
            }
        } catch (e) {}
        const fs = require('fs');
        if (fs.existsSync('auth_info_baileys')) {
            fs.rmSync('auth_info_baileys', { recursive: true, force: true });
        }
        connectionStatus = 'مغلق';
        lastQrCode = '';
        io.emit('wa_status', { status: connectionStatus });
        connectToWhatsApp();
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    addLog('SYSTEM', `الخادم بدأ العمل على بورت ${PORT}`);
    connectToWhatsApp(); 
});

import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSy_YOUR_MOCK_KEY");

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
                    const phoneNumber = from.split('@')[0];
                    
                    addLog('USER', `رسالة من ${pushName}: ${text}`);
                    liveMetrics.totalToday++;
                    liveMetrics.perMinute++;
                    
                    // Session Management
                    if (!chatSessions[from]) chatSessions[from] = { history: [], orderState: 'NONE' };
                    const session = chatSessions[from];
                    
                    session.history.push(`العميل: ${text}`);
                    if (session.history.length > 8) session.history.shift(); // Keep last 8 messages

                    const productListText = products.map(p => `- *${p.name}* (${p.specs})\n💰 السعر: ${p.price}`).join('\n\n');
                    
                    const isAdmin = phoneNumber === '201020118437' || phoneNumber === '201026672074';
                    
                    let systemPrompt = "";
                    if (isAdmin) {
                        systemPrompt = `أنت المساعد الذكي لإدارة نظام WhatsAI CRM.
أنت تتحدث الآن مع **المدير / الآدمن** (صاحب الصلاحيات العليا).
المهمة:
1. تنفيذ أوامر المدير (مثل إعطاء تقرير مختصر عن عدد الطلبات، أو شرح ميزة).
2. إذا طلب المدير ملخص المبيعات، أخبره أن النظام يعمل بكفاءة وأنه تم استلام ${liveMetrics.totalToday} رسالة اليوم.
3. كن عملياً ومباشراً وقم بتنسيق الإجابة بنقاط واضحة.`;
                    } else {
                        systemPrompt = `أنت مساعد مبيعات احترافي جداً لمتجر (WhatsAI Market).
أنت تتحدث مع العميل عبر الواتساب.
**قواعد الرد (صارمة جداً):**
1. **الترحيب**: رحب بالعميل بحفاوة في البداية واستخدم الإيموجي المناسبة.
2. **عرض المنتجات**: اعرض المنتجات بتنسيق الواتساب (استخدم نجمة * للخط العريض).
3. **الحجز (المعاملات)**: إذا طلب العميل منتجاً، يجب أن تطلب منه (الاسم الثنائي، العنوان بالتفصيل، ورقم بديل).
4. **تأكيد الأوردر (مهم جداً)**: إذا أعطاك العميل البيانات، يجب أن ترد عليه بفاتورة منسقة كالتالي:
   🧾 *تأكيد الطلب*
   رقم الطلب: #ORD-${Math.floor(Math.random() * 10000)}
   المنتج: [اسم المنتج]
   الاسم: [الاسم]
   العنوان: [العنوان]
   سيتم التواصل معك قريباً للتوصيل! 🚚
5. كن ودوداً ولا تخرج عن سياق المتجر أبداً.

**قائمة المنتجات المتوفرة حالياً:**
${productListText}

تاريخ المحادثة الأخير مع العميل لمعرفة السياق:
${session.history.join('\n')}

قم بالرد نيابة عن المتجر برد قصير، لطيف، واحترافي وباللغة العربية.`;
                    }

                    let aiReply = "";
                    try {
                        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
                        const result = await model.generateContent(systemPrompt);
                        aiReply = result.response.text();
                        // Handle potential AI asterisks escaping to ensure whatsapp bolds work correctly.
                        aiReply = aiReply.replace(/\*\*/g, '*');
                    } catch (error: any) {
                        console.error('Gemini Error:', error.message);
                        aiReply = "مرحباً بك! نأسف ولكن نظام الذكاء الاصطناعي يخضع لتحديث سريع في هذه اللحظة، سيتم الرد عليك في غضون دقائق.";
                        addLog('ERROR', 'فشل الذكاء الاصطناعي في الرد');
                    }

                    session.history.push(`أنت: ${aiReply}`);
                    addLog('AI', `رد البوت على ${pushName}`);

                    recentMessages.unshift({
                        from: pushName,
                        number: phoneNumber,
                        message: text,
                        time: new Date().toLocaleTimeString('ar-EG'),
                        ai: true,
                        aiResponse: aiReply // send AI reply to frontend too
                    });
                    if (recentMessages.length > 10) recentMessages.pop();

                    io.emit('new_message', recentMessages);
                    io.emit('metrics_update', liveMetrics);

                    if (waSocket) await waSocket.sendMessage(from, { text: aiReply });
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

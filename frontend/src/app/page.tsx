"use client";

import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { QRCodeSVG } from 'qrcode.react';
import {
  LayoutDashboard, Phone, Bot, MessageCircle, Store, Users, BarChart3, 
  TerminalSquare, Settings, ArrowUpLeft, Activity, Smartphone, CheckCircle2,
  QrCode, Zap, MessageSquare, Plus, Search, Filter, ShoppingCart, TrendingUp
} from 'lucide-react';
import styles from './page.module.css';

let socket: any;

export default function MasterCRM() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const [waStatus, setWaStatus] = useState('انتظار الربط');
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [qrStep, setQrStep] = useState(1);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  
  const [liveMetrics, setLiveMetrics] = useState({ totalToday: 0, perMinute: 0, activeUsers: 0 });
  const [messagesList, setMessagesList] = useState<any[]>([]);
  const [systemLogs, setSystemLogs] = useState<any[]>([]);

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://whats-ai-crm.vercel.app';
    socket = io(backendUrl);
    socket.on('wa_status', (data: any) => setWaStatus(data.status));
    socket.on('wa_qr', (qr: string) => setQrCodeData(qr));
    socket.on('metrics_update', (metrics: any) => setLiveMetrics(metrics));
    socket.on('new_message', (msgs: any[]) => setMessagesList(msgs));
    socket.on('new_log', (logs: any[]) => setSystemLogs(logs));
    return () => socket.disconnect();
  }, []);

  const openQrRequest = () => {
    socket.emit('request_qr');
    setActiveTab('channels');
    setSelectedChannel('whatsapp');
  };

  return (
    <div className={styles.container}>
      {/* ---------------- SIDEBAR ---------------- */}
      <aside className={styles.sidebar}>
        {/* Brand header removed */}

        
        <nav>
          <div className={`${styles.navItem} ${styles.overview} ${activeTab === 'overview' ? styles.active : ''}`} onClick={() => setActiveTab('overview')}>
            <LayoutDashboard size={20} /> نظرة عامة
          </div>
          <div className={`${styles.navItem} ${styles.channels} ${activeTab === 'channels' ? styles.active : ''}`} onClick={() => {setActiveTab('channels'); setSelectedChannel(null);}}>
            <MessageSquare size={20} /> قنوات الاتصال
          </div>
          <div className={`${styles.navItem} ${styles.ai} ${activeTab === 'ai' ? styles.active : ''}`} onClick={() => setActiveTab('ai')}>
            <Bot size={20} /> إعدادات الذكاء
          </div>
          <div className={`${styles.navItem} ${styles.chats} ${activeTab === 'chats' ? styles.active : ''}`} onClick={() => setActiveTab('chats')}>
            <MessageCircle size={20} /> البريد الوارد (Inbox)
          </div>
          <div className={`${styles.navItem} ${styles.campaigns} ${activeTab === 'campaigns' ? styles.active : ''}`} onClick={() => setActiveTab('campaigns')}>
            <Zap size={20} /> حملات التسويق (AI)
          </div>
          <div className={`${styles.navItem} ${styles.automations} ${activeTab === 'automations' ? styles.active : ''}`} onClick={() => setActiveTab('automations')}>
            <TerminalSquare size={20} /> الأتمتة الذكية
          </div>
          <div className={`${styles.navItem} ${styles.stores} ${activeTab === 'stores' ? styles.active : ''}`} onClick={() => setActiveTab('stores')}>
            <Store size={20} /> المتاجر والبائعين
          </div>
          <div className={`${styles.navItem} ${styles.customers} ${activeTab === 'customers' ? styles.active : ''}`} onClick={() => setActiveTab('customers')}>
            <Users size={20} /> العملاء
          </div>
          <div className={`${styles.navItem} ${styles.analytics} ${activeTab === 'analytics' ? styles.active : ''}`} onClick={() => setActiveTab('analytics')}>
            <BarChart3 size={20} /> التحليلات والتقارير
          </div>
          <div className={`${styles.navItem} ${styles.logs} ${activeTab === 'logs' ? styles.active : ''}`} onClick={() => setActiveTab('logs')}>
            <Activity size={20} /> سجلات النظام
          </div>
          <div className={`${styles.navItem} ${styles.settings} ${activeTab === 'settings' ? styles.active : ''}`} onClick={() => setActiveTab('settings')}>
            <Settings size={20} /> الإعدادات العامة
          </div>
        </nav>
      </aside>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className={styles.mainContent}>
        
        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in">
            <h1 className={styles.sectionTitle}><LayoutDashboard color="#3b82f6" /> نظرة عامة على النظام</h1>
            
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <div className={styles.statIcon} style={{background: 'rgba(34,211,238,0.1)', color: '#22d3ee'}}><MessageSquare size={24} /></div>
                  <span className={styles.statTrend} style={{background: 'rgba(16,185,129,0.1)', color: '#10b981'}}>مباشر</span>
                </div>
                <p className={styles.statTitle}>الرسائل المستلمة اليوم</p>
                <h3 className={styles.statValue}>{liveMetrics.totalToday}</h3>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <div className={styles.statIcon} style={{background: 'rgba(168,85,247,0.1)', color: '#a855f7'}}><ShoppingCart size={24} /></div>
                  <span className={styles.statTrend} style={{background: 'rgba(16,185,129,0.1)', color: '#10b981'}}>+14%</span>
                </div>
                <p className={styles.statTitle}>الأوردرات المحجوزة (AI)</p>
                <h3 className={styles.statValue}>{Math.floor(liveMetrics.totalToday * 0.4)}</h3>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <div className={styles.statIcon} style={{background: 'rgba(245,158,11,0.1)', color: '#f59e0b'}}><Zap size={24} /></div>
                  <span className={styles.statTrend} style={{background: 'rgba(16,185,129,0.1)', color: '#10b981'}}>ممتاز</span>
                </div>
                <p className={styles.statTitle}>سرعة الرد بالذكاء</p>
                <h3 className={styles.statValue}>1.2s</h3>
              </div>
            </div>

            <div className={styles.panel}>
              <h2 className={styles.panelTitle}><Smartphone color="#22d3ee" size={24}/> حالة الاتصال الحالية</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '16px' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: waStatus === 'متصل' ? '#10b981' : '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone color="#fff" size={24}/>
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem 0' }}>رقم المبيعات الرئيسي</h3>
                    <p style={{ margin: 0, color: '#9ca3af' }}>{waStatus === 'متصل' ? 'متصل وجاهز لاستقبال الطلبات' : 'غير متصل'}</p>
                  </div>
                </div>
                {waStatus !== 'متصل' && (
                  <button className={styles.btnPrimary} onClick={openQrRequest}>ربط الآن <ArrowUpLeft size={18}/></button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB: CHANNELS */}
        {activeTab === 'channels' && (
          <div className="animate-fade-in">
            {selectedChannel === 'whatsapp' ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                   <button onClick={() => setSelectedChannel(null)} className={styles.btnSecondary} style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#fff' }}><ArrowUpLeft size={20}/></button>
                   <h1 className={styles.sectionTitle} style={{ margin: 0 }}><Phone color="#10b981" /> إدارة ربط واتساب API</h1>
                </div>
            <div className={styles.panel} style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ display: 'inline-flex', background: 'rgba(16, 185, 129, 0.1)', padding: '1.5rem', borderRadius: '24px', marginBottom: '1.5rem' }}>
                <QrCode size={48} color="#10b981" />
              </div>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>إضافة حساب واتساب</h2>
              <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>أدخل رقم الهاتف الذي تود ربطه، ثم قم بمسح كود الـ QR لبدء العمل.</p>
              
              {qrStep === 1 ? (
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', direction: 'ltr' }}>
                    <select style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '1rem', borderRadius: '12px', fontSize: '1.1rem', outline: 'none' }}>
                      <option value="+20">+20 (Egypt)</option>
                      <option value="+966">+966 (Saudi Arabia)</option>
                      <option value="+971">+971 (UAE)</option>
                      <option value="+1">+1 (USA)</option>
                    </select>
                    <input type="text" placeholder="رقم الهاتف..." style={{ flex: 1, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '1rem', borderRadius: '12px', fontSize: '1.1rem', outline: 'none' }} />
                  </div>
                  <button 
                    onClick={() => { setQrStep(2); socket.emit('request_qr'); }} 
                    className={styles.btnPrimary} 
                    style={{ width: '100%', justifyContent: 'center', padding: '1rem', background: 'linear-gradient(to right, #10b981, #059669)' }}
                  >
                    متابعة لتوليد الـ QR
                  </button>
                </div>
              ) : (
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '2.5rem', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                  {qrCodeData ? (
                    <>
                      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 0 40px rgba(16, 185, 129, 0.2)' }}>
                        <QRCodeSVG value={qrCodeData} size={240} level="H" />
                      </div>
                      <p style={{ marginTop: '1.5rem', color: '#9ca3af' }}>امسح الكود الآن باستخدام واتساب الخاص بالرقم الذي أدخلته.</p>
                    </>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      {waStatus === 'متصل' ? (
                        <>
                          <CheckCircle2 size={64} color="#10b981" />
                          <span style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 'bold' }}>متصل بنجاح! الواتساب يعمل الآن.</span>
                          <button 
                            onClick={() => { setQrStep(1); setActiveTab('overview'); }} 
                            className={styles.btnPrimary} 
                            style={{ marginTop: '1rem', background: 'linear-gradient(to right, #3b82f6, #2563eb)' }}
                          >
                            <LayoutDashboard size={18}/> الدخول إلى لوحة التحكم (Dashboard)
                          </button>
                        </>
                      ) : (
                        <>
                          <div className={styles.spinner} style={{ borderColor: 'rgba(16, 185, 129, 0.2)', borderTopColor: '#10b981' }}></div>
                          <span style={{ color: '#10b981', fontSize: '1.2rem' }}>جاري جلب الكود من الخادم... ({waStatus})</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            </>
            ) : selectedChannel === 'facebook' || selectedChannel === 'instagram' ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                   <button onClick={() => setSelectedChannel(null)} className={styles.btnSecondary} style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#fff' }}><ArrowUpLeft size={20}/></button>
                   <h1 className={styles.sectionTitle} style={{ margin: 0 }}>
                     {selectedChannel === 'facebook' ? <img src="/icons/facebook.svg" width={32} /> : <img src="/icons/instagram.svg" width={32} />}
                     إعداد رابط الـ Webhook
                   </h1>
                </div>
                <div className={styles.panel} style={{ maxWidth: '800px', margin: '0 auto' }}>
                  <h2 style={{ marginBottom: '1rem' }}>إعدادات الربط مع منصة Meta (Facebook & Instagram)</h2>
                  <p style={{ color: '#9ca3af', marginBottom: '2rem', lineHeight: '1.6' }}>لربط صفحتك على {selectedChannel === 'facebook' ? 'فيسبوك' : 'انستجرام'} مع النظام، يرجى نسخ الروابط التالية وإدخالها في إعدادات الـ Webhook داخل حساب المطورين (Meta Developers).</p>
                  
                  <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                    <label style={{ color: '#6b7280', display: 'block', marginBottom: '0.5rem' }}>رابط الـ Webhook URL</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <input type="text" readOnly value="https://whats-ai-crm.vercel.app/webhook/meta" style={{ flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }} />
                      <button className={styles.btnSecondary} onClick={() => navigator.clipboard.writeText('https://whats-ai-crm.vercel.app/webhook/meta')}>نسخ</button>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
                    <label style={{ color: '#6b7280', display: 'block', marginBottom: '0.5rem' }}>رمز التوثيق (Verify Token)</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <input type="text" readOnly value="whatsaicrm_secure_token_2026" style={{ flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }} />
                      <button className={styles.btnSecondary} onClick={() => navigator.clipboard.writeText('whatsaicrm_secure_token_2026')}>نسخ</button>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className={styles.btnPrimary} style={{ background: 'linear-gradient(to right, #3b82f6, #2563eb)', flex: 1 }}>تم إعداد الـ Webhook بنجاح</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h1 className={styles.sectionTitle}><MessageSquare color="#3b82f6" /> قنوات الاتصال المدعومة</h1>
                <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>اختر القناة التي تود ربطها بالنظام للبدء في استقبال الرسائل عبر الذكاء الاصطناعي.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
                   <div onClick={() => setSelectedChannel('whatsapp')} style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem 1.5rem', borderRadius: '16px', cursor: 'pointer', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }} className="hover:bg-opacity-10">
                     <img src="/icons/whatsapp_cloud.svg" alt="WhatsApp Cloud" width={64} height={64} />
                     <h3 style={{ margin: 0, color: '#fff' }}>WhatsApp Cloud</h3>
                     <span style={{ fontSize: '0.8rem', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>مُوصى به</span>
                   </div>
                   <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem 1.5rem', borderRadius: '16px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', transition: 'all 0.2s' }} className="hover:bg-opacity-10">
                     <img src="/icons/whatsapp_business.svg" alt="WhatsApp Business" width={64} height={64} />
                     <h3 style={{ margin: 0, color: '#fff' }}>WhatsApp Business</h3>
                   </div>
                   <div onClick={() => setSelectedChannel('facebook')} style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem 1.5rem', borderRadius: '16px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', transition: 'all 0.2s' }} className="hover:bg-opacity-10">
                     <img src="/icons/facebook.svg" alt="Facebook Messenger" width={64} height={64} />
                     <h3 style={{ margin: 0, color: '#fff' }}>Messenger</h3>
                   </div>
                   <div onClick={() => setSelectedChannel('instagram')} style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem 1.5rem', borderRadius: '16px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', transition: 'all 0.2s' }} className="hover:bg-opacity-10">
                     <img src="/icons/instagram.svg" alt="Instagram" width={64} height={64} />
                     <h3 style={{ margin: 0, color: '#fff' }}>Instagram</h3>
                   </div>
                   <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem 1.5rem', borderRadius: '16px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', transition: 'all 0.2s' }} className="hover:bg-opacity-10">
                     <img src="/icons/telegram.svg" alt="Telegram" width={64} height={64} />
                     <h3 style={{ margin: 0, color: '#fff' }}>Telegram</h3>
                   </div>
                   <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem 1.5rem', borderRadius: '16px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', transition: 'all 0.2s' }} className="hover:bg-opacity-10">
                     <img src="/icons/tiktok.svg" alt="TikTok" width={64} height={64} />
                     <h3 style={{ margin: 0, color: '#fff' }}>TikTok</h3>
                   </div>
                   <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem 1.5rem', borderRadius: '16px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', transition: 'all 0.2s' }} className="hover:bg-opacity-10">
                     <img src="/icons/viber.svg" alt="Viber" width={64} height={64} />
                     <h3 style={{ margin: 0, color: '#fff' }}>Viber</h3>
                   </div>
                   <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem 1.5rem', borderRadius: '16px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', transition: 'all 0.2s' }} className="hover:bg-opacity-10">
                     <img src="/icons/line.svg" alt="Line" width={64} height={64} />
                     <h3 style={{ margin: 0, color: '#fff' }}>Line</h3>
                   </div>
                   <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem 1.5rem', borderRadius: '16px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', transition: 'all 0.2s' }} className="hover:bg-opacity-10">
                     <img src="/icons/wechat.svg" alt="WeChat" width={64} height={64} />
                     <h3 style={{ margin: 0, color: '#fff' }}>WeChat</h3>
                   </div>
                   <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem 1.5rem', borderRadius: '16px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', transition: 'all 0.2s', opacity: 0.8 }} className="hover:bg-opacity-10">
                     <img src="/icons/custom_channel.svg" alt="Custom Channel" width={64} height={64} />
                     <h3 style={{ margin: 0, color: '#fff' }}>قناة مخصصة (API)</h3>
                   </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB: AI SETTINGS */}
        {activeTab === 'ai' && (
          <div className="animate-fade-in">
            <h1 className={styles.sectionTitle}><Bot color="#a855f7" /> إعدادات الذكاء الاصطناعي</h1>
            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>تخصيص شخصية البوت (Gemini 1.5 Pro)</h2>
              <div className={styles.inputGroup}>
                <label>اسم المساعد الذكي</label>
                <input type="text" defaultValue="WhatsAI Market Assistant" />
              </div>
              <div className={styles.inputGroup}>
                <label>التعليمات البرمجية (System Prompt)</label>
                <textarea rows={5} defaultValue={`أنت مساعد مبيعات ذكي لمورد إلكترونيات.
مهمتك الترحيب بالعميل وعرض المنتجات.
في حال طلب العميل حجز أوردر، خذ منه: (الاسم، العنوان، رقم للتواصل).
كن ودوداً وتحدث بالعربية الاحترافية.`}></textarea>
              </div>
              <button className={styles.btnPrimary} style={{ background: 'linear-gradient(to right, #a855f7, #c084fc)' }}>حفظ الإعدادات</button>
            </div>
          </div>
        )}

        {/* TAB: LIVE CHATS (OMNICHANNEL INBOX) */}
        {activeTab === 'chats' && (
          <div className="animate-fade-in" style={{ height: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
               <h1 className={styles.sectionTitle} style={{ margin: 0 }}><MessageCircle color="#ec4899" /> صندوق الوارد الموحد (Omnichannel)</h1>
               <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className={styles.btnSecondary} style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>WhatsApp</button>
                  <button className={styles.btnSecondary} style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>Messenger</button>
                  <button className={styles.btnSecondary} style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>Instagram</button>
               </div>
            </div>
            <div className={styles.chatContainer} style={{ flex: 1, height: '100%' }}>
              <div className={styles.chatSidebar}>
                <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <input type="text" placeholder="بحث عن عميل..." style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                </div>
                {messagesList.length === 0 ? <p style={{ padding: '1rem', color: '#6b7280', textAlign: 'center' }}>لا توجد محادثات</p> : null}
                {messagesList.map((msg, idx) => (
                  <div key={idx} style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', background: idx === 0 ? 'rgba(236, 72, 153, 0.1)' : 'transparent' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <strong style={{ color: '#fff' }}>{msg.from}</strong>
                        {msg.platform === 'Instagram' ? <img src="/icons/instagram.svg" width={14} /> : msg.platform === 'Messenger' ? <img src="/icons/facebook.svg" width={14} /> : <img src="/icons/whatsapp_cloud.svg" width={14} />}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{msg.time}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#9ca3af', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg.message}</p>
                    {/* Mock Sentiment */}
                    <div style={{ marginTop: '0.5rem', fontSize: '0.7rem' }}>
                      {idx % 3 === 0 ? <span style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 6px', borderRadius: '4px' }}>😊 إيجابي</span> : 
                       idx % 2 === 0 ? <span style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '2px 6px', borderRadius: '4px' }}>😠 غاضب (تدخل مطلوب)</span> :
                       <span style={{ color: '#3b82f6', background: 'rgba(59,130,246,0.1)', padding: '2px 6px', borderRadius: '4px' }}>🤖 الذكاء الاصطناعي يتولى الأمر</span>}
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.chatMain}>
                <div className={styles.chatHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', background: '#ec4899', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {messagesList[0]?.from?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h3 style={{ margin: 0 }}>{messagesList[0]?.from || 'اختر محادثة'}</h3>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#10b981' }}>{messagesList[0]?.platform || 'WhatsApp'} - {messagesList[0]?.number}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className={styles.btnSecondary} style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>تعليق الذكاء الاصطناعي</button>
                    <button className={styles.btnPrimary} style={{ background: 'linear-gradient(to right, #10b981, #059669)' }}>إتمام الطلب</button>
                  </div>
                </div>
                <div className={styles.chatMessages}>
                  {messagesList.length > 0 && (
                    <>
                      <div className={`${styles.chatBubble} ${styles.human}`}>
                        {messagesList[0]?.message}
                        <div style={{ fontSize: '0.7rem', color: '#6b7280', textAlign: 'left', marginTop: '0.5rem' }}>{messagesList[0]?.time}</div>
                      </div>
                      {messagesList[0]?.aiResponse && (
                        <div className={`${styles.chatBubble} ${styles.ai}`}>
                          {messagesList[0]?.aiResponse}
                          <div style={{ fontSize: '0.7rem', color: '#a855f7', textAlign: 'right', marginTop: '0.5rem' }}>تم الرد بواسطة الذكاء الاصطناعي ✨</div>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div style={{ padding: '1rem', background: 'rgba(17,24,39,0.8)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '1rem' }}>
                  <input type="text" placeholder="اكتب رسالة يدوية للتدخل البشري..." style={{ flex: 1, padding: '1rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', outline: 'none' }} />
                  <button className={styles.btnPrimary} style={{ padding: '0 2rem' }}>إرسال</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: CAMPAIGNS (AI MARKETING) */}
        {activeTab === 'campaigns' && (
          <div className="animate-fade-in">
            <h1 className={styles.sectionTitle}><Zap color="#f59e0b" /> حملات التسويق الذكية (AI Campaigns)</h1>
            <div className={styles.statsGrid} style={{ marginBottom: '2rem' }}>
              <div className={styles.statCard}>
                <p className={styles.statTitle}>الحملات النشطة</p>
                <h3 className={styles.statValue}>2</h3>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statTitle}>رسائل تم إرسالها</p>
                <h3 className={styles.statValue}>1,402</h3>
              </div>
              <div className={styles.statCard}>
                <p className={styles.statTitle}>نسبة التحويل (Conversion)</p>
                <h3 className={styles.statValue} style={{ color: '#10b981' }}>24%</h3>
              </div>
            </div>

            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>إنشاء حملة تسويقية عبر الذكاء الاصطناعي</h2>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <div style={{ flex: 1 }}>
                  <div className={styles.inputGroup}>
                    <label>الهدف من الحملة</label>
                    <textarea rows={4} placeholder="مثال: قم بكتابة رسالة جذابة تقدم خصم 20% لعملاء الـ VIP بمناسبة العيد، استخدم إيموجي لطيفة واطلب منهم زيارة الموقع..." style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', outline: 'none' }}></textarea>
                  </div>
                  <button className={styles.btnPrimary} style={{ background: 'linear-gradient(to right, #a855f7, #c084fc)' }}>✨ توليد الرسالة بالذكاء الاصطناعي</button>
                </div>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                  <h3 style={{ marginTop: 0, color: '#9ca3af' }}>الرسالة المولدة:</h3>
                  <div style={{ background: '#0f172a', padding: '1.5rem', borderRadius: '12px', color: '#e2e8f0', minHeight: '150px' }}>
                    مرحباً يا غالي! 🌙✨<br/><br/>
                    بمناسبة العيد حابين نعايد عليك بخصم خاص جداً (20%) على جميع منتجاتنا لأنك من عملائنا المميزين (VIP) 💎.<br/><br/>
                    استخدم كود الخصم: EID20<br/>
                    اطلب الآن قبل نفاذ الكمية! 🏃‍♂️💨
                  </div>
                </div>
              </div>
              
              <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ color: '#9ca3af' }}>استهداف:</span>
                  <select style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.8rem', borderRadius: '8px', outline: 'none' }}>
                    <option>جميع عملاء الواتساب (1,200)</option>
                    <option>عملاء الـ VIP فقط (150)</option>
                    <option>السلات المتروكة (43)</option>
                  </select>
                </div>
                <button className={styles.btnPrimary} style={{ background: 'linear-gradient(to right, #10b981, #059669)', fontSize: '1.1rem', padding: '1rem 3rem' }}>إطلاق الحملة الآن 🚀</button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: AUTOMATIONS */}
        {activeTab === 'automations' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h1 className={styles.sectionTitle} style={{ margin: 0 }}><TerminalSquare color="#3b82f6" /> الأتمتة والردود الآلية المتقدمة</h1>
              <button className={styles.btnPrimary}><Plus size={18}/> إنشاء قاعدة جديدة</button>
            </div>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #10b981', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>توجيه العملاء الغاضبين للموظف (Sentiment Routing)</h3>
                  <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.9rem' }}>إذا اكتشف الذكاء الاصطناعي أن العميل <strong style={{color:'#ef4444'}}>غاضب</strong> ➔ أوقف البوت وأرسل إشعاراً للمدير فوراً.</p>
                </div>
                <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: '#10b981' }} />
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #3b82f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>متابعة السلات المتروكة (Abandoned Cart)</h3>
                  <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.9rem' }}>إذا لم يكمل العميل الشراء خلال ساعتين ➔ أرسل له رسالة تحفيزية بخصم 5%.</p>
                </div>
                <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: '#10b981' }} />
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #a855f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>تحية خارج أوقات العمل</h3>
                  <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.9rem' }}>من الساعة 12 ص إلى 8 ص ➔ أرسل: "مرحباً، المتجر مغلق الآن لكن تفضل بترك طلبك وسننفذه صباحاً".</p>
                </div>
                <input type="checkbox" style={{ width: '20px', height: '20px', accentColor: '#10b981' }} />
              </div>
            </div>
          </div>
        )}

        {/* TAB: STORES */}
        {activeTab === 'stores' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h1 className={styles.sectionTitle} style={{ margin: 0 }}><Store color="#f59e0b" /> المتاجر والبائعين</h1>
              <button className={styles.btnPrimary} style={{ background: 'linear-gradient(to right, #f59e0b, #d97706)' }}><Plus size={18}/> إضافة متجر</button>
            </div>
            <div className={styles.panel}>
              <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr><th>اسم المتجر</th><th>الرقم المرتبط</th><th>إجمالي المبيعات</th><th>حالة المتجر</th><th>الإجراءات</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>إلكترونيات المستقبل</strong></td>
                      <td style={{fontFamily: 'monospace'}}>+20101234567</td>
                      <td style={{color: '#10b981'}}>$45,000</td>
                      <td><span className={styles.badge} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>نشط</span></td>
                      <td><button style={{ background: 'transparent', border: '1px solid #374151', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px' }}>إدارة</button></td>
                    </tr>
                    <tr>
                      <td><strong>موضة ستايل</strong></td>
                      <td style={{fontFamily: 'monospace'}}>+96650123456</td>
                      <td style={{color: '#10b981'}}>$12,400</td>
                      <td><span className={styles.badge} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>نشط</span></td>
                      <td><button style={{ background: 'transparent', border: '1px solid #374151', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px' }}>إدارة</button></td>
                    </tr>
                    <tr>
                      <td><strong>متجر العطور الذكية</strong></td>
                      <td style={{fontFamily: 'monospace'}}>غير مرتبط</td>
                      <td style={{color: '#6b7280'}}>$0</td>
                      <td><span className={styles.badge} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>موقوف</span></td>
                      <td><button style={{ background: 'transparent', border: '1px solid #374151', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px' }}>إدارة</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: CUSTOMERS */}
        {activeTab === 'customers' && (
          <div className="animate-fade-in">
            <h1 className={styles.sectionTitle}><Users color="#0ea5e9" /> قاعدة بيانات العملاء (CRM)</h1>
            <div className={styles.panel}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <Search size={18} style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#6b7280' }} />
                  <input type="text" placeholder="بحث برقم الهاتف أو الاسم..." style={{ width: '100%', padding: '0.8rem 2.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                </div>
                <button className={styles.btnSecondary}><Filter size={18} /> تصفية</button>
              </div>
              <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr><th>اسم العميل</th><th>رقم الهاتف</th><th>عدد الطلبات</th><th>تاريخ آخر طلب</th><th>تقييم الذكاء الاصطناعي</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>أحمد محمد</td><td style={{fontFamily: 'monospace'}}>+201020118437</td>
                      <td>5 طلبات</td><td>اليوم 10:30 ص</td>
                      <td><span className={styles.badge} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>عميل VIP (شراء مؤكد)</span></td>
                    </tr>
                    <tr>
                      <td>خالد عبدالله</td><td style={{fontFamily: 'monospace'}}>+96655512345</td>
                      <td>طلب واحد</td><td>أمس</td>
                      <td><span className={styles.badge} style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>متردد</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="animate-fade-in">
            <h1 className={styles.sectionTitle}><BarChart3 color="#6366f1" /> التحليلات والتقارير المتقدمة</h1>
            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>الإيرادات بواسطة الذكاء الاصطناعي (أسبوعي)</h2>
              <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '2rem', padding: '2rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {[40, 60, 30, 80, 50, 90, 100].map((h, i) => (
                  <div key={i} style={{ flex: 1, background: `linear-gradient(to top, rgba(99,102,241,0.2), rgba(99,102,241,0.8))`, height: `${h}%`, borderRadius: '8px 8px 0 0', position: 'relative' }}>
                    <span style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', color: '#9ca3af', fontSize: '0.8rem' }}>{h * 100}$</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>
                <span>السبت</span><span>الأحد</span><span>الاثنين</span><span>الثلاثاء</span><span>الأربعاء</span><span>الخميس</span><span>الجمعة</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB: LOGS */}
        {activeTab === 'logs' && (
          <div className="animate-fade-in">
            <h1 className={styles.sectionTitle}><TerminalSquare color="#ef4444" /> سجلات النظام المركزية (Logs)</h1>
            <div className={styles.panel} style={{ background: '#000', fontFamily: 'monospace' }}>
              <div style={{ height: '600px', overflowY: 'auto', paddingRight: '1rem' }}>
                {systemLogs.length === 0 ? <p style={{ color: '#6b7280', textAlign: 'center', marginTop: '3rem' }}>لا توجد سجلات. النظام قيد الانتظار.</p> : null}
                {systemLogs.map((log, i) => (
                  <div key={i} style={{ marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #1f2937' }}>
                    <span style={{ color: '#6b7280', marginRight: '15px' }}>[{log.time}]</span>
                    <span style={{ 
                      color: log.type === 'ERROR' ? '#ef4444' : log.type === 'SUCCESS' ? '#10b981' : log.type === 'USER' ? '#3b82f6' : log.type === 'AI' ? '#a855f7' : '#f59e0b',
                      fontWeight: 'bold', marginRight: '15px', display: 'inline-block', width: '80px'
                    }}>
                      [{log.type}]
                    </span>
                    <span style={{ color: '#d1d5db', fontSize: '1.05rem' }}>{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="animate-fade-in">
            <h1 className={styles.sectionTitle}><Settings color="#9ca3af" /> الإعدادات وإدارة الصلاحيات</h1>
            
            {/* General Settings */}
            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>الإعدادات العامة</h2>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div className={styles.inputGroup} style={{ flex: 1, minWidth: '300px' }}>
                  <label>اسم المنصة الرئيسي</label>
                  <input type="text" defaultValue="WhatsAI Master CRM" />
                </div>
                <div className={styles.inputGroup} style={{ flex: 1, minWidth: '300px' }}>
                  <label>العملة الافتراضية</label>
                  <input type="text" defaultValue="SAR (ريال سعودي)" />
                </div>
              </div>
              <button className={styles.btnPrimary} style={{ background: '#374151', marginTop: '1rem' }}>حفظ التعديلات</button>
            </div>

            {/* Team Management (Roles) */}
            <div className={styles.panel}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className={styles.panelTitle} style={{ margin: 0 }}>إدارة فريق العمل والصلاحيات</h2>
                <button className={styles.btnPrimary} style={{ background: 'linear-gradient(to right, #10b981, #059669)' }}><Plus size={18}/> إضافة عضو جديد</button>
              </div>
              <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr><th>الاسم / الدور</th><th>رقم الهاتف</th><th>الصلاحية</th><th>تاريخ الإضافة</th><th>الإجراءات</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>مدير المبيعات</strong></td>
                      <td style={{fontFamily: 'monospace', direction: 'ltr', textAlign: 'right'}}>+20 102 667 2074</td>
                      <td><span className={styles.badge} style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>Manager (مدير)</span></td>
                      <td>أمس</td>
                      <td>
                        <button style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>إزالة</button>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>الآدمن (المالك)</strong></td>
                      <td style={{fontFamily: 'monospace', direction: 'ltr', textAlign: 'right'}}>+20 102 011 8437</td>
                      <td><span className={styles.badge} style={{ background: 'rgba(168,85,247,0.1)', color: '#a855f7' }}>Admin (مسؤول)</span></td>
                      <td>منذ شهر</td>
                      <td>
                        <button style={{ background: 'rgba(255,255,255,0.05)', color: '#6b7280', border: '1px solid rgba(255,255,255,0.1)', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'not-allowed' }} disabled>لا يمكن إزالته</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Manage WhatsApp Numbers */}
            <div className={styles.panel}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 className={styles.panelTitle} style={{ margin: 0 }}>أرقام الواتساب المرتبطة بالنظام</h2>
                <button className={styles.btnPrimary} onClick={openQrRequest} style={{ background: 'linear-gradient(to right, #3b82f6, #2563eb)' }}><Phone size={18}/> إضافة رقم جديد</button>
              </div>
              <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                  <thead>
                    <tr><th>اسم الرقم</th><th>الرقم</th><th>الذكاء الاصطناعي</th><th>حالة الرقم</th><th>الإجراءات</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>رقم المبيعات الرئيسي</strong></td>
                      <td style={{fontFamily: 'monospace'}}>الرقم المربوط حالياً</td>
                      <td><span className={styles.badge} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>مُفعل ✅</span></td>
                      <td><span className={styles.badge} style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>{waStatus}</span></td>
                      <td style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => setActiveTab('overview')} style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>لوحة التحكم</button>
                        <button onClick={() => { if(window.confirm('هل أنت متأكد من إزالة الرقم؟ سيتم فصل البوت فوراً.')) socket.emit('logout'); }} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>إزالة</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
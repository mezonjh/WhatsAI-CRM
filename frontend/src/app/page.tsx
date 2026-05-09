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
  
  const [liveMetrics, setLiveMetrics] = useState({ totalToday: 0, perMinute: 0, activeUsers: 0 });
  const [messagesList, setMessagesList] = useState<any[]>([]);
  const [systemLogs, setSystemLogs] = useState<any[]>([]);

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
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
    setActiveTab('whatsapp');
  };

  return (
    <div className={styles.container}>
      {/* ---------------- SIDEBAR ---------------- */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span>WhatsAI</span> <span style={{color: '#fff', fontSize: '1.2rem'}}>CRM</span>
        </div>
        
        <nav>
          <div className={`${styles.navItem} ${styles.overview} ${activeTab === 'overview' ? styles.active : ''}`} onClick={() => setActiveTab('overview')}>
            <LayoutDashboard size={20} /> نظرة عامة
          </div>
          <div className={`${styles.navItem} ${styles.whatsapp} ${activeTab === 'whatsapp' ? styles.active : ''}`} onClick={() => setActiveTab('whatsapp')}>
            <Phone size={20} /> ربط واتساب API
          </div>
          <div className={`${styles.navItem} ${styles.ai} ${activeTab === 'ai' ? styles.active : ''}`} onClick={() => setActiveTab('ai')}>
            <Bot size={20} /> إعدادات الذكاء
          </div>
          <div className={`${styles.navItem} ${styles.chats} ${activeTab === 'chats' ? styles.active : ''}`} onClick={() => setActiveTab('chats')}>
            <MessageCircle size={20} /> المحادثات المباشرة
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
            <TerminalSquare size={20} /> سجلات النظام
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

        {/* TAB: WHATSAPP API */}
        {activeTab === 'whatsapp' && (
          <div className="animate-fade-in">
            <h1 className={styles.sectionTitle}><Phone color="#10b981" /> إدارة ربط واتساب API</h1>
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

        {/* TAB: LIVE CHATS */}
        {activeTab === 'chats' && (
          <div className="animate-fade-in">
            <h1 className={styles.sectionTitle}><MessageCircle color="#ec4899" /> المحادثات المباشرة (Live)</h1>
            <div className={styles.chatContainer}>
              <div className={styles.chatSidebar}>
                <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <input type="text" placeholder="بحث عن عميل..." style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                </div>
                {messagesList.length === 0 ? <p style={{ padding: '1rem', color: '#6b7280', textAlign: 'center' }}>لا توجد محادثات</p> : null}
                {messagesList.map((msg, idx) => (
                  <div key={idx} style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', background: idx === 0 ? 'rgba(236, 72, 153, 0.1)' : 'transparent' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <strong style={{ color: '#fff' }}>{msg.from}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{msg.time}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#9ca3af', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{msg.message}</p>
                  </div>
                ))}
              </div>
              <div className={styles.chatMain}>
                <div className={styles.chatHeader}>
                  <div style={{ width: '40px', height: '40px', background: '#ec4899', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {messagesList[0]?.from?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h3 style={{ margin: 0 }}>{messagesList[0]?.from || 'اختر محادثة'}</h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#10b981' }}>{messagesList[0]?.number}</p>
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
                <div style={{ padding: '1rem', background: 'rgba(17,24,39,0.8)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <input type="text" placeholder="اكتب رسالة يدوية للتدخل البشري..." style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                </div>
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
                        <button style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>إزالة</button>
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
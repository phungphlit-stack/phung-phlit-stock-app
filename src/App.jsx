import React, { useState, useEffect } from 'react';
import { LogOut, MessageSquare, Send, Search } from 'lucide-react';
import { saveStockData, listenToStockData, sendMessage, listenToMessages } from './services/firebase';
import { BACKOFFICE_STOCK, FRONTSTORE_STOCK } from './data/stockData';

const StockAppV35 = () => {
  const [lang, setLang] = useState('th');
  const [currentUser, setCurrentUser] = useState(null);
  const [pinInput, setPinInput] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState({});
  const [stockData, setStockData] = useState([]);
  const [activeTab, setActiveTab] = useState('backoffice');
  const [loading, setLoading] = useState(false);

  const t = {
    th: {
      app_title: 'ผึ้งผลิต | ระบบเช็คสต็อก',
      login: 'เข้าสู่ระบบ',
      select_role: 'เลือกบทบาท',
      owner: 'เจ้าของร้าน',
      backoffice: 'ทีมหลังบ้าน',
      frontstore: 'ทีมหน้าร้าน',
      enter_pin: 'กรอก PIN',
      pin_error: 'PIN ไม่ถูกต้อง',
      dashboard: 'แดชบอร์ด',
      low_stock: 'สต็อกต่ำ',
      all_items: 'ทั้งหมด',
      search: 'ค้นหาสินค้า...',
      quantity: 'จำนวน',
      unit: 'หน่วย',
      min_alert: 'แจ้งเตือน',
      logout: 'ออกจากระบบ',
      messages: 'ข้อความ',
      type_message: 'พิมพ์ข้อความ...',
      no_messages: 'ไม่มีข้อความ',
      back_office_stock: 'สต็อก หลังบ้าน',
      front_store_stock: 'สต็อก หน้าร้าน',
      to_owner: 'ส่งไปยังเจ้าของร้าน',
      from_backoffice: 'จากทีมหลังบ้าน',
      from_frontstore: 'จากทีมหน้าร้าน',
    },
    en: {
      app_title: 'Phung Phlit | Stock Check System',
      login: 'Login',
      select_role: 'Select Role',
      owner: 'Owner',
      backoffice: 'Back-office',
      frontstore: 'Front-store',
      enter_pin: 'Enter PIN',
      pin_error: 'Invalid PIN',
      dashboard: 'Dashboard',
      low_stock: 'Low Stock',
      all_items: 'All Items',
      search: 'Search products...',
      quantity: 'Quantity',
      unit: 'Unit',
      min_alert: 'Alert',
      logout: 'Logout',
      messages: 'Messages',
      type_message: 'Type message...',
      no_messages: 'No messages',
      back_office_stock: 'Back-office Stock',
      front_store_stock: 'Front-store Stock',
      to_owner: 'To owner',
      from_backoffice: 'From Back-office',
      from_frontstore: 'From Front-store',
    },
  };

  const text = t[lang];

  const unitTranslations = {
    'แพ็ค': { th: 'แพ็ค', en: 'Pack' },
    'ขวด': { th: 'ขวด', en: 'Bottle' },
    'กล่อง': { th: 'กล่อง', en: 'Box' },
    'ชิ้น': { th: 'ชิ้น', en: 'Piece' },
    'แถว': { th: 'แถว', en: 'Row' },
    'ลัง': { th: 'ลัง', en: 'Carton' },
    'แกลอน': { th: 'แกลอน', en: 'Gallon' },
    'กระปุก': { th: 'กระปุก', en: 'Jar' },
  };

  const getUnitText = (unit) => {
    return unitTranslations[unit]?.[lang] || unit;
  };

  const categoryTranslations = {
    'ไอศกรีม': { th: 'ไอศกรีม', en: 'Ice Cream' },
    'ผลิตภัณฑ์ผึ้ง': { th: 'ผลิตภัณฑ์ผึ้ง', en: 'Bee Products' },
    'อื่นๆ': { th: 'อื่นๆ', en: 'Others' },
    'วัตถุดิบและอุปกรณ์': { th: 'วัตถุดิบและอุปกรณ์', en: 'Raw Materials' },
    'ผลิตภัณฑ์ (ขาย)': { th: 'ผลิตภัณฑ์ (ขาย)', en: 'Products (Sale)' },
  };

  const getCategoryText = (category) => {
    return categoryTranslations[category]?.[lang] || category;
  };

  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      const initialData = currentUser.role === 'backoffice' ? BACKOFFICE_STOCK : FRONTSTORE_STOCK;
      setStockData([...initialData]);
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      const role = currentUser.role;
      const unsubscribe = listenToStockData(role, (data) => {
        if (data && Array.isArray(data)) {
          setStockData(data);
        }
      });
      return () => unsubscribe?.();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      const role = currentUser.role;
      const unsubscribe = listenToMessages(role, (msgs) => {
        setMessages((prev) => ({
          ...prev,
          [role]: msgs,
        }));
      });
      return () => unsubscribe?.();
    }
  }, [currentUser]);

  // หลังบ้าน (backoffice) ไม่ต้องใส่ PIN
  const handleBackofficeSelect = () => {
    setCurrentUser({
      name: 'ทีมหลังบ้าน',
      role: 'backoffice',
    });
  };

  // หน้าร้าน (frontstore) ไม่ต้องใส่ PIN
  const handleFrontstoreSelect = () => {
    setCurrentUser({
      name: 'ทีมหน้าร้าน',
      role: 'frontstore',
    });
  };

  // Owner ต้องใส่ PIN
  const handleOwnerSelect = () => {
    setSelectedRole('owner');
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === '4510' && selectedRole) {
      setCurrentUser({
        name: 'เจ้าของ',
        role: selectedRole,
      });
      setPinInput('');
      setSelectedRole(null);
    } else {
      alert(text.pin_error);
      setPinInput('');
    }
  };

  const handleQtyChange = async (id, newQty) => {
    const updatedData = stockData.map((item) =>
      item.id === id ? { ...item, qty: Math.max(0, newQty), lastUpdatedTime: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) } : item
    );
    setStockData(updatedData);
    
    if (currentUser) {
      await saveStockData(currentUser.role, updatedData);
    }
  };

  const handleSendMessage = async () => {
    if (chatMessage.trim() && currentUser) {
      const msg = {
        from: currentUser.name,
        text: chatMessage,
      };
      
      await sendMessage(currentUser.role, msg);
      setChatMessage('');
    }
  };

  const filteredStock = stockData.filter((item) => {
    const matchesSearch = item.name_th.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name_en.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const alertStockItems = filteredStock.filter((item) => 
    item.qty === 0 || (item.qty > 0 && item.qty <= item.minAlert)
  );
  const displayData = 
    currentUser?.role === 'owner' ? alertStockItems : 
    currentUser?.role === 'backoffice' ? alertStockItems :
    filteredStock;

  if (!currentUser) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: 'linear-gradient(135deg, #f5f0e8 0%, #ede8dc 100%)',
        padding: '20px',
      }}>
        <div style={{
          background: 'white', padding: '40px 30px', borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(196, 146, 91, 0.15)', width: '100%', maxWidth: '360px',
        }}>
          <h1 style={{ color: '#725446', fontSize: '28px', textAlign: 'center', marginBottom: '8px' }}>🐝 ผึ้งผลิต</h1>
          <p style={{ color: '#8B9D7F', fontSize: '13px', textAlign: 'center', marginBottom: '25px' }}>
            {text.app_title}
          </p>

          {!selectedRole ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={handleBackofficeSelect}
                style={{
                  padding: '12px', border: 'none', borderRadius: '8px',
                  background: '#C4925B', color: 'white', cursor: 'pointer',
                  fontWeight: 'bold', fontSize: '14px', transition: 'all 0.3s',
                }}>
                {text.backoffice}
              </button>
              <button
                onClick={handleFrontstoreSelect}
                style={{
                  padding: '12px', border: 'none', borderRadius: '8px',
                  background: '#C4925B', color: 'white', cursor: 'pointer',
                  fontWeight: 'bold', fontSize: '14px', transition: 'all 0.3s',
                }}>
                {text.frontstore}
              </button>
              <button
                onClick={handleOwnerSelect}
                style={{
                  padding: '12px', border: 'none', borderRadius: '8px',
                  background: '#C4925B', color: 'white', cursor: 'pointer',
                  fontWeight: 'bold', fontSize: '14px', transition: 'all 0.3s',
                }}>
                {text.owner}
              </button>
            </div>
          ) : (
            <form onSubmit={handlePinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input
                type="password"
                maxLength="4"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder={text.enter_pin}
                style={{
                  padding: '12px', fontSize: '18px', border: '2px solid #C4925B',
                  borderRadius: '8px', textAlign: 'center', letterSpacing: '8px',
                  fontWeight: 'bold', color: '#725446', fontFamily: 'monospace',
                }}
                autoFocus
              />
              <button type="submit" style={{
                padding: '12px', background: '#C4925B', color: 'white',
                border: 'none', borderRadius: '8px', fontWeight: 'bold',
                cursor: 'pointer', transition: 'all 0.3s',
              }}>
                {text.login}
              </button>
              <button
                type="button"
                onClick={() => { setSelectedRole(null); setPinInput(''); }}
                style={{
                  padding: '10px', background: 'transparent', color: '#8B9D7F',
                  border: '1px solid #8B9D7F', borderRadius: '6px', cursor: 'pointer',
                  fontSize: '13px',
                }}>
                Cancel
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh',
      background: '#F5F0E8',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #725446 0%, #8B9D7F 100%)', color: 'white',
        padding: '12px 16px', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flex: 'none', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      }}>
        <div>
          <h1 style={{ margin: '0', fontSize: '18px', fontWeight: 'bold' }}>🐝 ผึ้งผลิต</h1>
          <p style={{ margin: '0', fontSize: '11px', opacity: 0.8 }}>{currentUser.name}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
            style={{
              padding: '7px 12px', background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.4)', borderRadius: '4px',
              color: 'white', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold',
            }}>
            {lang === 'th' ? 'EN' : 'TH'}
          </button>
          <button onClick={() => {
            setCurrentUser(null);
            setStockData([]);
            setMessages({});
          }}
            style={{
              padding: '7px 12px', background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.4)', borderRadius: '4px',
              color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center',
              gap: '5px', fontSize: '11px', fontWeight: 'bold',
            }}>
            <LogOut size={13} /> {text.logout}
          </button>
        </div>
      </div>

      {currentUser.role === 'owner' && (
        <div style={{
          background: 'white', borderBottom: '1px solid #E5DDD0',
          display: 'flex', gap: '0', flex: 'none',
        }}>
          {['backoffice', 'frontstore'].map((tab) => (
            <button key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedCategory('all');
                setSearchQuery('');
                setStockData(tab === 'backoffice' ? [...BACKOFFICE_STOCK] : [...FRONTSTORE_STOCK]);
              }}
              style={{
                flex: 1, padding: '10px', border: 'none', background: activeTab === tab ? '#C4925B' : 'transparent',
                color: activeTab === tab ? 'white' : '#725446', cursor: 'pointer',
                fontWeight: 'bold', fontSize: '13px', borderBottom: activeTab === tab ? '2px solid #8B9D7F' : 'none',
              }}>
              {tab === 'backoffice' ? text.back_office_stock : text.front_store_stock}
            </button>
          ))}
        </div>
      )}

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto',
      }}>
        <div style={{
          background: 'white', padding: '12px 16px', borderBottom: '1px solid #E5DDD0',
          display: 'flex', gap: '10px', flex: 'none', flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '200px' }}>
            <Search size={16} color="#C4925B" />
            <input
              type="text"
              placeholder={text.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1, border: 'none', background: 'transparent', outline: 'none',
                fontSize: '13px', color: '#725446',
              }}
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '7px 10px', border: '1px solid #C4925B', borderRadius: '4px',
              background: 'white', color: '#725446', fontSize: '12px', cursor: 'pointer',
            }}>
            <option value="all">{text.all_items}</option>
            <option value="ไอศกรีม">{getCategoryText('ไอศกรีม')}</option>
            <option value="ผลิตภัณฑ์ผึ้ง">{getCategoryText('ผลิตภัณฑ์ผึ้ง')}</option>
            <option value="วัตถุดิบและอุปกรณ์">{getCategoryText('วัตถุดิบและอุปกรณ์')}</option>
            <option value="ผลิตภัณฑ์ (ขาย)">{getCategoryText('ผลิตภัณฑ์ (ขาย)')}</option>
            <option value="อื่นๆ">{getCategoryText('อื่นๆ')}</option>
          </select>
        </div>

        <div style={{
          padding: '12px 16px', flex: 1, overflowY: 'auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
          gap: '10px',
        }}>
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px', color: '#8B9D7F' }}>
              Loading...
            </div>
          ) : displayData.length > 0 ? (
            displayData.map((item) => {
              const isEmpty = item.qty === 0;
              const isLow = !isEmpty && item.qty <= item.minAlert;
              return (
                <div key={item.id} style={{
                  background: 'white', borderRadius: '8px', padding: '10px',
                  boxShadow: '0 2px 6px rgba(196, 146, 91, 0.1)',
                  borderLeft: isEmpty ? '3px solid #FAD0E2' : (isLow ? '3px solid #EFE4AC' : '3px solid #C7D9BD'),
                }}>
                  {isEmpty && <div style={{ display: 'inline-block', background: '#FAD0E2', color: '#725446', padding: '3px 7px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', marginBottom: '7px' }}>Out</div>}
                  {!isEmpty && isLow && <div style={{ display: 'inline-block', background: '#EFE4AC', color: '#725446', padding: '3px 7px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', marginBottom: '7px' }}>Low</div>}

                  <h4 style={{ margin: '5px 0 3px 0', fontSize: '13px', fontWeight: 'bold', color: '#725446', lineHeight: '1.3' }}>
                    {lang === 'th' ? item.name_th : item.name_en}
                  </h4>

                  <p style={{ margin: '2px 0 7px 0', fontSize: '11px', color: '#8B9D7F' }}>
                    {getCategoryText(item.category)}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px', marginBottom: '9px', padding: '7px', background: '#FFFBF5', borderRadius: '6px' }}>
                    <div>
                      <p style={{ margin: '0 0 3px 0', color: '#8B9D7F', fontSize: '10px' }}>{text.quantity}</p>
                      <p style={{ margin: '0', fontWeight: 'bold', color: '#725446', fontSize: '14px' }}>{item.qty} {getUnitText(item.unit)}</p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 3px 0', color: '#8B9D7F', fontSize: '10px' }}>{text.min_alert}</p>
                      <p style={{ margin: '0', fontWeight: 'bold', color: '#C4925B', fontSize: '13px' }}>{item.minAlert}</p>
                    </div>
                  </div>

                  {currentUser.role !== 'owner' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px', marginTop: '9px' }}>
                      <button onClick={() => handleQtyChange(item.id, item.qty - 1)} style={{ padding: '7px', border: 'none', borderRadius: '4px', background: '#FAD0E2', color: '#725446', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>−</button>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F0E8', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', color: '#725446' }}>{item.qty}</div>
                      <button onClick={() => handleQtyChange(item.id, item.qty + 1)} style={{ padding: '7px', border: 'none', borderRadius: '4px', background: '#C7D9BD', color: '#725446', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>+</button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '35px 20px', color: '#8B9D7F' }}>
              <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '0' }}>No items</p>
            </div>
          )}
        </div>
      </div>

      {currentUser && (
        <div style={{ background: 'white', borderTop: '1px solid #E5DDD0', display: 'flex', flexDirection: 'column', maxHeight: '230px', flex: 'none' }}>
          <div style={{ padding: '9px 16px', borderBottom: '1px solid #E5DDD0', display: 'flex', alignItems: 'center', gap: '7px', fontWeight: 'bold', color: '#725446', fontSize: '13px', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <MessageSquare size={15} /> {text.messages} ({(messages[currentUser.role] || []).length})
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '11px 16px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {(messages[currentUser.role] || []).length > 0 ? (
              (messages[currentUser.role] || []).map((msg, idx) => (
                <div key={idx} style={{ background: '#F5F0E8', padding: '9px 11px', borderRadius: '6px', fontSize: '12px', borderLeft: '2px solid #C4925B' }}>
                  <p style={{ margin: '0 0 2px 0', fontWeight: 'bold', color: '#725446', fontSize: '11px' }}>{msg.from}</p>
                  <p style={{ margin: '0 0 2px 0', color: '#725446', wordWrap: 'break-word', fontSize: '12px' }}>{msg.text}</p>
                  <p style={{ margin: '0', fontSize: '10px', color: '#8B9D7F' }}>{msg.time}</p>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#8B9D7F', padding: '16px 11px', fontSize: '12px' }}>{text.no_messages}</div>
            )}
          </div>

          <div style={{ padding: '9px 16px', borderTop: '1px solid #E5DDD0', display: 'flex', gap: '7px', flex: 'none' }}>
            <input type="text" placeholder={text.type_message} value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} style={{ flex: 1, padding: '9px 11px', border: '1px solid #E5DDD0', borderRadius: '6px', fontSize: '12px', fontFamily: 'inherit', outline: 'none' }} />
            <button onClick={handleSendMessage} style={{ padding: '9px 11px', border: 'none', borderRadius: '6px', background: '#C4925B', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockAppV35;

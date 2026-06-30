import React, { useState, useEffect } from 'react';
import { Lock, LogOut, MessageSquare, Send, Search, Plus, Minus, Edit2, Trash2, Check, X, Settings, AlertCircle } from 'lucide-react';

const StockAppV35 = () => {
  const [lang, setLang] = useState('th');
  const [currentUser, setCurrentUser] = useState(null);
  const [pinInput, setPinInput] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState({}); // { backoffice: [], frontstore: [] }
  const [stockData, setStockData] = useState([]);
  const [activeTab, setActiveTab] = useState('backoffice');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name_th: '',
    name_en: '',
    category: '',
    qty: 0,
    unit: 'แพ็ค',
    minAlert: 0,
  });
  const [lastUpdated, setLastUpdated] = useState(null);

  // Translations
  const t = {
    th: {
      app_title: 'ผึ้งผลิต | ระบบเช็คสต๊อก',
      login: 'เข้าสู่ระบบ',
      select_role: 'เลือกบทบาท',
      owner: 'เจ้าของร้าน',
      backoffice: 'ทีมหลังบ้าน',
      frontstore: 'ทีมหน้าร้าน',
      enter_pin: 'กรอก PIN',
      pin_error: 'PIN ไม่ถูกต้อง',
      dashboard: 'แดชบอร์ด',
      low_stock: 'สต๊อกต่ำ',
      all_items: 'ทั้งหมด',
      search: 'ค้นหาสินค้า...',
      quantity: 'จำนวน',
      unit: 'หน่วย',
      min_alert: 'แจ้งเตือน',
      add: 'เพิ่ม',
      save: 'บันทึก',
      cancel: 'ยกเลิก',
      logout: 'ออกจากระบบ',
      messages: 'ข้อความ',
      type_message: 'พิมพ์ข้อความ...',
      from: 'จาก',
      no_messages: 'ไม่มีข้อความ',
      admin_panel: 'แผงควบคุม',
      add_product: 'เพิ่มสินค้า',
      edit_product: 'แก้ไข',
      delete: 'ลบ',
      product_name_th: 'ชื่อสินค้า (ไทย)',
      product_name_en: 'ชื่อสินค้า (English)',
      category: 'หมวดหมู่',
      initial_qty: 'จำนวน',
      alert_level: 'แจ้งเตือน',
      last_updated: 'อัปเดตล่าสุด',
      by: 'โดย', back_office_stock: 'สต๊อก หลังบ้าน',
      front_store_stock: 'สต๊อก หน้าร้าน',
      settings: 'ตั้งค่า',
      sure_delete: 'คุณแน่ใจหรือ?',
      ice_cream: 'ไอศกรีม',
      bee_products: 'ผลิตภัณฑ์ผึ้ง',
      other: 'อื่นๆ',
      raw_materials: 'วัตถุดิบและอุปกรณ์',
      products_for_sale: 'ผลิตภัณฑ์ (ขาย)',
      send_message: 'ส่ง',
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
      add: 'Add',
      save: 'Save',
      cancel: 'Cancel',
      logout: 'Logout',
      messages: 'Messages',
      type_message: 'Type message...',
      from: 'From',
      no_messages: 'No messages',
      admin_panel: 'Admin Panel',
      add_product: 'Add Product',
      edit_product: 'Edit',
      delete: 'Delete',
      product_name_th: 'Product Name (Thai)',
      product_name_en: 'Product Name (English)',
      category: 'Category',
      initial_qty: 'Quantity',
      alert_level: 'Alert',
      last_updated: 'Last Updated',
      by: 'by',
      back_office_stock: 'Back-office Stock',
      front_store_stock: 'Front-store Stock',
      settings: 'Settings',
      sure_delete: 'Are you sure?',
      ice_cream: 'Ice Cream',
      bee_products: 'Bee Products',
      other: 'Others',
      raw_materials: 'Raw Materials & Supplies',
      products_for_sale: 'Products (Sale)',
      send_message: 'Send',
      to_owner: 'To owner',
      from_backoffice: 'From Back-office',
      from_frontstore: 'From Front-store',
    },
  };

  const text = t[lang];

  // Unit translations
  const unitTranslations = {
    'แพ็ค': { th: 'แพ็ค', en: 'Pack' },
    'ขวด': { th: 'ขวด', en: 'Bottle' },
    'กล่อง': { th: 'กล่อง', en: 'Box' },
    'ชิ้น': { th: 'ชิ้น', en: 'Piece' },
    'แถว': { th: 'แถว', en: 'Row' },
    'ลัง': { th: 'ลัง', en: 'Carton' },
    'แกลอน': { th: 'แกลอน', en: 'Gallon' },
    'กระปุก': { th: 'กระปุก', en: 'Jar' },
    'แผ่น': { th: 'แผ่น', en: 'Sheet' },
    'ม้วน': { th: 'ม้วน', en: 'Roll' },
    'กิโลกรัม': { th: 'กิโลกรัม', en: 'kg' },
  };

  const getUnitText = (unit) => {
    return unitTranslations[unit]?.[lang] || unit;
  };

  // Category translations
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

  // ===== BACKOFFICE DATA (Sheet 1) - 25 items =====
  const backofficeDataFull = [
    { id: 1, name_th: 'วนิลลาน้ำผึ้ง ผงไอศครีม', name_en: 'Vanilla Honey Ice Cream Powder', category: 'ไอศกรีม', qty: 10, unit: 'แพ็ค', minAlert: 3, lastUpdatedBy: 'ทีมหลังบ้าน', lastUpdatedTime: '11:30' },
    { id: 2, name_th: 'โยเกิร์ต ผงไอศครีม', name_en: 'Yogurt Ice Cream Powder', category: 'ไอศกรีม', qty: 8, unit: 'แพ็ค', minAlert: 3, lastUpdatedBy: 'ทีมหลังบ้าน', lastUpdatedTime: '11:25' },
    { id: 3, name_th: 'ซอเบ ผงไอศครีม', name_en: 'Sorbet Ice Cream Powder', category: 'ไอศกรีม', qty: 6, unit: 'แพ็ค', minAlert: 5, lastUpdatedBy: 'เจ้าของ', lastUpdatedTime: '10:45' },
    { id: 4, name_th: 'โคนไอศครีม (แถว)', name_en: 'Ice Cream Cone (Row)', category: 'ไอศกรีม', qty: 15, unit: 'แถว', minAlert: 5, lastUpdatedBy: 'ทีมหลังบ้าน', lastUpdatedTime: '11:15' },
    { id: 5, name_th: 'โคนไอศครีม (ลัง)', name_en: 'Ice Cream Cone (Carton)', category: 'ไอศกรีม', qty: 2, unit: 'ลัง', minAlert: 1, lastUpdatedBy: 'เจ้าของ', lastUpdatedTime: '09:50' },
    { id: 6, name_th: 'ช้อนไอศกรีม (แพ็ค 100 ชิ้น)', name_en: 'Ice Cream Spoon (Pack 100)', category: 'ไอศกรีม', qty: 7, unit: 'แพ็ค', minAlert: 6, lastUpdatedBy: 'เจ้าของ', lastUpdatedTime: '10:20' },
    { id: 7, name_th: 'ถ้วยไอศครีม ลายสีแดง', name_en: 'Ice Cream Cup Red', category: 'ไอศกรีม', qty: 8, unit: 'แถว', minAlert: 5, lastUpdatedBy: 'ทีมหลังบ้าน', lastUpdatedTime: '11:10' },
    { id: 8, name_th: 'ถ้วยไอศครีม ลายสีขาว', name_en: 'Ice Cream Cup White', category: 'ไอศกรีม', qty: 20, unit: 'แถว', minAlert: 10, lastUpdatedBy: 'ทีมหลังบ้าน', lastUpdatedTime: '11:00' },
    { id: 9, name_th: 'ถ้วยไอศครีม ลายสีม่วง', name_en: 'Ice Cream Cup Purple', category: 'ไอศกรีม', qty: 20, unit: 'แถว', minAlert: 10, lastUpdatedBy: 'เจ้าของ', lastUpdatedTime: '10:00' },
    { id: 10, name_th: 'ปอกไอศครีม ลายสีแดง', name_en: 'Ice Cream Stick Red', category: 'ไอศกรีม', qty: 30, unit: 'ชิ้น', minAlert: 20, lastUpdatedBy: 'ทีมหลังบ้าน', lastUpdatedTime: '10:55' },
    { id: 11, name_th: 'ปอกไอศครีม ลายสีขาว', name_en: 'Ice Cream Stick White', category: 'ไอศกรีม', qty: 70, unit: 'ชิ้น', minAlert: 50, lastUpdatedBy: 'เจ้าของ', lastUpdatedTime: '09:30' },
    { id: 12, name_th: 'ปอกไอศครีม ลายสีม่วง', name_en: 'Ice Cream Stick Purple', category: 'ไอศกรีม', qty: 200, unit: 'ชิ้น', minAlert: 100, lastUpdatedBy: 'ทีมหลังบ้าน', lastUpdatedTime: '11:05' },
    { id: 13, name_th: 'น้ำผึ้งดอกไม้ป่า 1 กก.', name_en: 'Wild Flower Honey 1 kg', category: 'ผลิตภัณฑ์ผึ้ง', qty: 12, unit: 'ขวด', minAlert: 0, lastUpdatedBy: 'ทีมหลังบ้าน', lastUpdatedTime: '11:20' },
    { id: 14, name_th: 'น้ำผึ้งดอกลำไย 1 กก.', name_en: 'Longan Honey 1 kg', category: 'ผลิตภัณฑ์ผึ้ง', qty: 9, unit: 'ขวด', minAlert: 0, lastUpdatedBy: 'เจ้าของ', lastUpdatedTime: '10:15' },
    { id: 15, name_th: 'น้ำผึ้งดอกไม้ป่า 7 กก.', name_en: 'Wild Flower Honey 7 kg', category: 'ผลิตภัณฑ์ผึ้ง', qty: 4, unit: 'แกลอน', minAlert: 1, lastUpdatedBy: 'ทีมหลังบ้าน', lastUpdatedTime: '11:12' },
    { id: 16, name_th: 'น้ำผึ้งดอกลำไย 7 กก.', name_en: 'Longan Honey 7 kg', category: 'ผลิตภัณฑ์ผึ้ง', qty: 0, unit: 'แกลอน', minAlert: 0, lastUpdatedBy: 'เจ้าของ', lastUpdatedTime: '09:45' },
    { id: 17, name_th: 'น้ำผึ้งดอกไม้ป่า 30 กก.', name_en: 'Wild Flower Honey 30 kg', category: 'ผลิตภัณฑ์ผึ้ง', qty: 1, unit: 'แกลอน', minAlert: 0.5, lastUpdatedBy: 'ทีมหลังบ้าน', lastUpdatedTime: '10:40' },
    { id: 18, name_th: 'น้ำผึ้งดอกลำไย 30 กก.', name_en: 'Longan Honey 30 kg', category: 'ผลิตภัณฑ์ผึ้ง', qty: 0, unit: 'แกลอน', minAlert: 0, lastUpdatedBy: 'เจ้าของ', lastUpdatedTime: '09:15' },
    { id: 19, name_th: 'นมผึ้งสด 500 กรัม', name_en: 'Fresh Royal Jelly 500g', category: 'ผลิตภัณฑ์ผึ้ง', qty: 2, unit: 'กระปุก', minAlert: 1, lastUpdatedBy: 'ทีมหลังบ้าน', lastUpdatedTime: '11:08' },
    { id: 20, name_th: 'กระปุกเปล่านมผึ้ง 500 กรัม', name_en: 'Empty Royal Jelly Jar 500g', category: 'ผลิตภัณฑ์ผึ้ง', qty: 10, unit: 'กระปุก', minAlert: 3, lastUpdatedBy: 'เจ้าของ', lastUpdatedTime: '10:30' },
    { id: 24, name_th: 'เจลรักษาความเย็น', name_en: 'Cooling Gel', category: 'อื่นๆ', qty: 5, unit: 'ชิ้น', minAlert: 2, lastUpdatedBy: 'ทีมหลังบ้าน', lastUpdatedTime: '11:02' },
    { id: 25, name_th: 'กล่องโฟม (ใส่นมผึ้งสด)', name_en: 'Foam Box (Royal Jelly)', category: 'อื่นๆ', qty: 2, unit: 'กล่อง', minAlert: 1, lastUpdatedBy: 'เจ้าของ', lastUpdatedTime: '10:10' },
  ];

  // ===== FRONTSTORE DATA (Sheet 2) =====
  const frontstoreDataFull = [
    { id: 1, name_th: 'วนิลลาน้ำผึ้ง ผงไอศครีม', name_en: 'Vanilla Honey Ice Cream Powder', category: 'วัตถุดิบและอุปกรณ์', qty: 10, unit: 'แพ็ค', minAlert: 3, lastUpdatedBy: 'ทีมหน้าร้าน', lastUpdatedTime: '11:28' },
    { id: 2, name_th: 'โยเกิร์ต ผงไอศครีม', name_en: 'Yogurt Ice Cream Powder', category: 'วัตถุดิบและอุปกรณ์', qty: 8, unit: 'แพ็ค', minAlert: 3, lastUpdatedBy: 'ทีมหน้าร้าน', lastUpdatedTime: '11:20' },
    { id: 3, name_th: 'ซอเบ ผงไอศครีม', name_en: 'Sorbet Ice Cream Powder', category: 'วัตถุดิบและอุปกรณ์', qty: 6, unit: 'แพ็ค', minAlert: 5, lastUpdatedBy: 'เจ้าของ', lastUpdatedTime: '10:50' },
    { id: 4, name_th: 'โคนไอศครีม (แถว)', name_en: 'Ice Cream Cone (Row)', category: 'วัตถุดิบและอุปกรณ์', qty: 15, unit: 'แถว', minAlert: 5, lastUpdatedBy: 'ทีมหน้าร้าน', lastUpdatedTime: '11:18' },
    { id: 5, name_th: 'โคนไอศครีม (ลัง)', name_en: 'Ice Cream Cone (Carton)', category: 'วัตถุดิบและอุปกรณ์', qty: 1, unit: 'ลัง', minAlert: 0, lastUpdatedBy: 'เจ้าของ', lastUpdatedTime: '10:00' },
    { id: 6, name_th: 'ช้อนไอศกรีม (แพ็ค 100 ชิ้น)', name_en: 'Ice Cream Spoon (Pack 100)', category: 'วัตถุดิบและอุปกรณ์', qty: 7, unit: 'แพ็ค', minAlert: 3, lastUpdatedBy: 'ทีมหน้าร้าน', lastUpdatedTime: '11:15' },
    { id: 7, name_th: 'รวงผึ้ง (ใส่ไอศกรีม)', name_en: 'Honeycomb (for Ice Cream)', category: 'วัตถุดิบและอุปกรณ์', qty: 5, unit: 'กล่อง', minAlert: 2, lastUpdatedBy: 'เจ้าของ', lastUpdatedTime: '10:25' },
    { id: 8, name_th: 'น้ำผึ้ง ใส่ไอศกรีม (แบบแกลอน)', name_en: 'Honey for Ice Cream (Gallon)', category: 'วัตถุดิบและอุปกรณ์', qty: 1, unit: 'แกลอน', minAlert: 0.5, lastUpdatedBy: 'ทีมหน้าร้าน', lastUpdatedTime: '11:10' },
    { id: 9, name_th: 'น้ำผึ้ง ใส่ไอศกรีม (แบบขวด)', name_en: 'Honey for Ice Cream (Bottle)', category: 'วัตถุดิบและอุปกรณ์', qty: 1, unit: 'ขวด', minAlert: 1, lastUpdatedBy: 'เจ้าของ', lastUpdatedTime: '10:35' },
    { id: 27, name_th: 'รวงผึ้ง 250 g', name_en: 'Honeycomb 250g', category: 'ผลิตภัณฑ์ (ขาย)', qty: 3, unit: 'กล่อง', minAlert: 1, lastUpdatedBy: 'ทีมหน้าร้าน', lastUpdatedTime: '11:22' },
    { id: 28, name_th: 'รวงผึ้ง 350 g', name_en: 'Honeycomb 350g', category: 'ผลิตภัณฑ์ (ขาย)', qty: 3, unit: 'กล่อง', minAlert: 1, lastUpdatedBy: 'ทีมหน้าร้าน', lastUpdatedTime: '11:19' },
    { id: 29, name_th: 'เกสรผึ้ง 100 g', name_en: 'Bee Pollen 100g', category: 'ผลิตภัณฑ์ (ขาย)', qty: 2, unit: 'กระปุก', minAlert: 1, lastUpdatedBy: 'เจ้าของ', lastUpdatedTime: '10:40' },
    { id: 30, name_th: 'เกสรผึ้ง 250 g', name_en: 'Bee Pollen 250g', category: 'ผลิตภัณฑ์ (ขาย)', qty: 2, unit: 'กระปุก', minAlert: 1, lastUpdatedBy: 'ทีมหน้าร้าน', lastUpdatedTime: '11:16' },
    { id: 31, name_th: 'น้ำผึ้งดอกลำไย 200 g', name_en: 'Longan Honey 200 g', category: 'ผลิตภัณฑ์ (ขาย)', qty: 4, unit: 'ชิ้น', minAlert: 1, lastUpdatedBy: 'เจ้าของ', lastUpdatedTime: '10:20' },
    { id: 32, name_th: 'น้ำผึ้งดอกไม้ป่า 200 g', name_en: 'Wild Flower Honey 200 g', category: 'ผลิตภัณฑ์ (ขาย)', qty: 4, unit: 'ชิ้น', minAlert: 1, lastUpdatedBy: 'ทีมหน้าร้าน', lastUpdatedTime: '11:13' },
    { id: 35, name_th: 'ถุงมือ M', name_en: 'Glove M', category: 'อื่นๆ', qty: 1, unit: 'กล่อง', minAlert: 0, lastUpdatedBy: 'เจ้าของ', lastUpdatedTime: '10:00' },
    { id: 36, name_th: 'ถุงมือ L', name_en: 'Glove L', category: 'อื่นๆ', qty: 1, unit: 'กล่อง', minAlert: 0, lastUpdatedBy: 'ทีมหน้าร้าน', lastUpdatedTime: '11:05' },
    { id: 37, name_th: 'ถุงขยะ', name_en: 'Trash Bag', category: 'อื่นๆ', qty: 2, unit: 'แพ็ค', minAlert: 0, lastUpdatedBy: 'เจ้าของ', lastUpdatedTime: '10:10' },
    { id: 38, name_th: 'ทิชชู่เช็ดปาก (แพ็ค 4 ชิ้น)', name_en: 'Tissue (Pack 4)', category: 'อื่นๆ', qty: 4, unit: 'แพ็ค', minAlert: 1, lastUpdatedBy: 'ทีมหน้าร้าน', lastUpdatedTime: '11:08' },
    { id: 39, name_th: 'ทิชชู่เปียก', name_en: 'Wet Tissue', category: 'อื่นๆ', qty: 2, unit: 'แพ็ค', minAlert: 0, lastUpdatedBy: 'เจ้าของ', lastUpdatedTime: '10:30' },
    { id: 40, name_th: 'ทิชชู่เอนกประสงค์', name_en: 'Multi-purpose Tissue', category: 'อื่นๆ', qty: 1, unit: 'ม้วน', minAlert: 0, lastUpdatedBy: 'ทีมหน้าร้าน', lastUpdatedTime: '11:03' },
    { id: 41, name_th: 'ผ้าเช็ด', name_en: 'Cleaning Cloth', category: 'อื่นๆ', qty: 3, unit: 'ชิ้น', minAlert: 2, lastUpdatedBy: 'เจ้าของ', lastUpdatedTime: '10:15' },
    { id: 42, name_th: 'นามบัตรร้าน (ชิ้น)', name_en: 'Business Card', category: 'อื่นๆ', qty: 10, unit: 'ชิ้น', minAlert: 1, lastUpdatedBy: 'ทีมหน้าร้าน', lastUpdatedTime: '11:01' },
  ];

  // Get data based on role
  useEffect(() => {
    if (currentUser?.role === 'owner') {
      if (activeTab === 'backoffice') {
        setStockData(backofficeDataFull);
      } else {
        setStockData(frontstoreDataFull);
      }
    } else if (currentUser?.role === 'backoffice') {
      setStockData(backofficeDataFull);
    } else if (currentUser?.role === 'frontstore') {
      setStockData(frontstoreDataFull);
    }
    setSelectedCategory('all');
    setSearchQuery('');
    
    // Initialize messages
    if (!messages.backoffice) setMessages(prev => ({ ...prev, backoffice: [] }));
    if (!messages.frontstore) setMessages(prev => ({ ...prev, frontstore: [] }));
  }, [activeTab, currentUser]);

  const getCategories = () => {
    return [...new Set(stockData.map(item => item.category))];
  };

  const handlePINInput = (num) => {
    const newPin = pinInput + num.toString();
    if (newPin.length < 4) {
      setPinInput(newPin);
    } else if (newPin.length === 4) {
      setPinInput(newPin);
      setTimeout(() => {
        if (newPin === '4510') {
          setCurrentUser({ role: 'owner', name: text.owner });
          setPinInput('');
        } else {
          alert(text.pin_error);
          setPinInput('');
        }
      }, 100);
    }
  };

  const handleRoleSelect = (role) => {
    const roleNames = { backoffice: text.backoffice, frontstore: text.frontstore };
    setCurrentUser({ role, name: roleNames[role] });
    setSelectedRole(role);
  };

  const filteredData = stockData.filter(item => {
    const matchesSearch = item.name_th.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.name_en.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    if (currentUser?.role === 'owner') {
      const isLowStock = item.qty <= item.minAlert;
      return matchesSearch && matchesCategory && isLowStock;
    }
    
    return matchesSearch && matchesCategory;
  });

  const handleQtyChange = (id, newQty) => {
    const updated = stockData.map(item =>
      item.id === id ? {
        ...item,
        qty: Math.max(0, newQty),
        lastUpdatedBy: currentUser.name,
        lastUpdatedTime: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
      } : item
    );
    setStockData(updated);
    setLastUpdated({
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      user: currentUser.name,
    });
  };

  const handleAddProduct = () => {
    if (!formData.name_th || !formData.name_en || !formData.category) {
      alert('กรุณากรอกข้อมูลให้ครบ');
      return;
    }
    
    const newItem = {
      id: Math.max(...stockData.map(i => i.id), 0) + 1,
      ...formData,
      qty: parseInt(formData.qty) || 0,
      minAlert: parseInt(formData.minAlert) || 0,
      lastUpdatedBy: currentUser.name,
      lastUpdatedTime: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    };
    
    setStockData([...stockData, newItem]);
    setShowAddForm(false);
    setFormData({
      name_th: '',
      name_en: '',
      category: getCategories()[0] || '',
      qty: 0,
      unit: 'แพ็ค',
      minAlert: 0,
    });
    setLastUpdated({
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      user: currentUser.name,
    });
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm(text.sure_delete)) {
      setStockData(stockData.filter(item => item.id !== id));
      setLastUpdated({
        time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        user: currentUser.name,
      });
    }
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const role = currentUser.role === 'owner' ? activeTab : currentUser.role;
      const newMessage = {
        id: (messages[role]?.length || 0) + 1,
        from: currentUser.name,
        text: chatMessage,
        time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages(prev => ({
        ...prev,
        [role]: [...(prev[role] || []), newMessage]
      }));
      setChatMessage('');
    }
  };

  const getCurrentChatMessages = () => {
    if (currentUser.role === 'owner') {
      return messages[activeTab] || [];
    }
    return messages[currentUser.role] || [];
  };

  // LOGIN SCREEN
  if (!currentUser) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #EDE8DC 0%, #F5F0E8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        padding: '20px',
      }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 10px 40px rgba(196, 146, 91, 0.1)',
          maxWidth: '400px',
          width: '100%',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '56px', marginBottom: '20px' }}>🐝</div>
            <h1 style={{ color: '#725446', fontSize: '28px', fontWeight: 'bold', margin: '0 0 10px 0' }}>
              ผึ้งผลิต
            </h1>
            <p style={{ color: '#8B9D7F', fontSize: '16px', margin: '0' }}>
              Stock Check System v3.5
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '35px', justifyContent: 'center' }}>
            <button onClick={() => setLang('th')} style={{
              padding: '10px 20px', border: 'none', borderRadius: '8px',
              background: lang === 'th' ? '#C4925B' : '#F5F0E8',
              color: lang === 'th' ? 'white' : '#725446',
              cursor: 'pointer', fontWeight: lang === 'th' ? 'bold' : 'normal',
              fontSize: '14px',
            }}>ไทย</button>
            <button onClick={() => setLang('en')} style={{
              padding: '10px 20px', border: 'none', borderRadius: '8px',
              background: lang === 'en' ? '#C4925B' : '#F5F0E8',
              color: lang === 'en' ? 'white' : '#725446',
              cursor: 'pointer', fontWeight: lang === 'en' ? 'bold' : 'normal',
              fontSize: '14px',
            }}>English</button>
          </div>

          {!selectedRole ? (
            <div>
              <p style={{ color: '#725446', textAlign: 'center', fontWeight: 'bold', marginBottom: '25px', fontSize: '16px' }}>
                {text.select_role}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button onClick={() => setSelectedRole('owner')} style={{
                  padding: '16px', border: '2px solid #C4925B', borderRadius: '10px',
                  background: 'white', color: '#725446', cursor: 'pointer',
                  fontWeight: 'bold', fontSize: '16px',
                }} onMouseOver={(e) => { e.currentTarget.style.background = '#C4925B'; e.currentTarget.style.color = 'white'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#725446'; }}>
                  {text.owner}
                </button>
                <button onClick={() => handleRoleSelect('backoffice')} style={{
                  padding: '16px', border: '2px solid #8B9D7F', borderRadius: '10px',
                  background: 'white', color: '#725446', cursor: 'pointer',
                  fontWeight: 'bold', fontSize: '16px',
                }} onMouseOver={(e) => { e.currentTarget.style.background = '#8B9D7F'; e.currentTarget.style.color = 'white'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#725446'; }}>
                  {text.backoffice}
                </button>
                <button onClick={() => handleRoleSelect('frontstore')} style={{
                  padding: '16px', border: '2px solid #AEA1CE', borderRadius: '10px',
                  background: 'white', color: '#725446', cursor: 'pointer',
                  fontWeight: 'bold', fontSize: '16px',
                }} onMouseOver={(e) => { e.currentTarget.style.background = '#AEA1CE'; e.currentTarget.style.color = 'white'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#725446'; }}>
                  {text.frontstore}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p style={{ color: '#725446', textAlign: 'center', fontWeight: 'bold', marginBottom: '25px', fontSize: '16px' }}>
                {text.enter_pin}
              </p>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '25px', justifyContent: 'center' }}>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} style={{
                    width: '56px', height: '56px',
                    background: pinInput.length >= i ? '#C4925B' : '#F5F0E8',
                    borderRadius: '12px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', color: '#725446',
                  }}>
                    {pinInput.length >= i ? '●' : '○'}
                  </div>
                ))}
              </div>
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px', marginBottom: '20px',
              }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                  <button key={num} onClick={() => { if (pinInput.length < 4) handlePINInput(num); }}
                    style={{
                      padding: '16px', fontSize: '20px', fontWeight: 'bold', border: 'none',
                      borderRadius: '10px', background: '#F5F0E8', color: '#725446', cursor: 'pointer',
                      gridColumn: num === 0 ? '2' : 'auto',
                    }}>
                    {num}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setPinInput(pinInput.slice(0, -1))} style={{
                  flex: 1, padding: '14px', border: 'none', borderRadius: '10px',
                  background: '#F5F0E8', color: '#725446', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px',
                }}>⌫</button>
                <button onClick={() => setSelectedRole(null)} style={{
                  flex: 1, padding: '14px', border: 'none', borderRadius: '10px',
                  background: '#FFFBF5', color: '#8B9D7F', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px',
                }}>← {lang === 'th' ? 'กลับ' : 'Back'}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // MAIN APP
  return (
    <div style={{ minHeight: '100vh', background: '#FFFBF5', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #C4925B 0%, #8B9D7F 100%)',
        color: 'white', padding: '14px 20px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        flex: 'none',
      }}>
        <div>
          <h1 style={{ margin: '0 0 3px 0', fontSize: '18px', fontWeight: 'bold' }}>
            🐝 ผึ้งผลิต v3.5
          </h1>
          <p style={{ margin: '0', fontSize: '12px', opacity: 0.85 }}>
            {currentUser.name} {lastUpdated && `• ${lastUpdated.time}`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={() => setLang(lang === 'th' ? 'en' : 'th')} style={{
            background: 'rgba(255,255,255,0.3)', border: 'none', color: 'white',
            padding: '7px 12px', borderRadius: '6px', cursor: 'pointer',
            fontSize: '12px', fontWeight: 'bold',
          }}>{lang === 'th' ? 'EN' : 'TH'}</button>
          {currentUser.role === 'owner' && (
            <button onClick={() => setShowAdminPanel(!showAdminPanel)} style={{
              background: 'rgba(255,255,255,0.3)', border: 'none', color: 'white',
              padding: '7px 12px', borderRadius: '6px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px',
            }}>
              <Settings size={15} /> ตั้งค่า
            </button>
          )}
          <button onClick={() => { setCurrentUser(null); setSelectedRole(null); }} style={{
            background: 'rgba(255,255,255,0.3)', border: 'none', color: 'white',
            padding: '7px 12px', borderRadius: '6px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px',
          }}>
            <LogOut size={15} /> ออก
          </button>
        </div>
      </div>

      {/* Tabs - Owner Only */}
      {currentUser.role === 'owner' && (
        <div style={{
          background: 'white', borderBottom: '1px solid #E5DDD0',
          display: 'flex', padding: '0 20px', flex: 'none',
        }}>
          <button onClick={() => setActiveTab('backoffice')} style={{
            flex: 1, padding: '14px', border: 'none',
            background: activeTab === 'backoffice' ? '#C4925B' : 'transparent',
            color: activeTab === 'backoffice' ? 'white' : '#725446',
            cursor: 'pointer', fontWeight: 'bold', fontSize: '14px',
            borderBottom: activeTab === 'backoffice' ? '3px solid #C4925B' : 'none',
          }}>
            {text.back_office_stock}
          </button>
          <button onClick={() => setActiveTab('frontstore')} style={{
            flex: 1, padding: '14px', border: 'none',
            background: activeTab === 'frontstore' ? '#8B9D7F' : 'transparent',
            color: activeTab === 'frontstore' ? 'white' : '#725446',
            cursor: 'pointer', fontWeight: 'bold', fontSize: '14px',
            borderBottom: activeTab === 'frontstore' ? '3px solid #8B9D7F' : 'none',
          }}>
            {text.front_store_stock}
          </button>
        </div>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
        {/* Admin Panel */}
        {currentUser.role === 'owner' && showAdminPanel && (
          <div style={{
            background: 'white', borderRadius: '10px', padding: '13px', marginBottom: '13px',
            border: '2px solid #C4925B',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '11px' }}>
              <h3 style={{ margin: '0', color: '#725446', fontSize: '14px', fontWeight: 'bold' }}>⚙️ {text.admin_panel}</h3>
              <button onClick={() => setShowAddForm(!showAddForm)} style={{
                padding: '7px 14px', background: '#C4925B', color: 'white',
                border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold',
                fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                <Plus size={15} /> {text.add_product}
              </button>
            </div>

            {showAddForm && (
              <div style={{
                background: '#FFFBF5', padding: '11px', borderRadius: '8px',
                border: '1px solid #E5DDD0', marginBottom: '11px',
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px', marginBottom: '11px' }}>
                  <input placeholder={text.product_name_th} value={formData.name_th}
                    onChange={(e) => setFormData({ ...formData, name_th: e.target.value })}
                    style={{ padding: '9px', border: '1px solid #E5DDD0', borderRadius: '6px', fontFamily: 'inherit', fontSize: '13px' }} />
                  <input placeholder={text.product_name_en} value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    style={{ padding: '9px', border: '1px solid #E5DDD0', borderRadius: '6px', fontFamily: 'inherit', fontSize: '13px' }} />
                  <select value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ padding: '9px', border: '1px solid #E5DDD0', borderRadius: '6px', fontFamily: 'inherit', fontSize: '13px', cursor: 'pointer' }}>
                    {getCategories().map(cat => <option key={cat} value={cat}>{getCategoryText(cat)}</option>)}
                  </select>
                  <input type="number" placeholder={text.initial_qty} value={formData.qty}
                    onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
                    style={{ padding: '9px', border: '1px solid #E5DDD0', borderRadius: '6px', fontFamily: 'inherit', fontSize: '13px' }} />
                  <input placeholder={text.unit} value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    style={{ padding: '9px', border: '1px solid #E5DDD0', borderRadius: '6px', fontFamily: 'inherit', fontSize: '13px' }} />
                  <input type="number" placeholder={text.alert_level} value={formData.minAlert}
                    onChange={(e) => setFormData({ ...formData, minAlert: e.target.value })}
                    style={{ padding: '9px', border: '1px solid #E5DDD0', borderRadius: '6px', fontFamily: 'inherit', fontSize: '13px' }} />
                </div>
                <div style={{ display: 'flex', gap: '9px' }}>
                  <button onClick={handleAddProduct} style={{
                    flex: 1, padding: '9px', background: '#C4925B', color: 'white',
                    border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px',
                  }}>✓ {text.save}</button>
                  <button onClick={() => setShowAddForm(false)} style={{
                    flex: 1, padding: '9px', background: '#E5DDD0', color: '#725446',
                    border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px',
                  }}>✕ {text.cancel}</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Alert Banner */}
        {currentUser.role === 'owner' && !showAdminPanel && (
          <div style={{
            background: '#FAD0E2', color: '#725446', padding: '9px 14px',
            borderRadius: '6px', marginBottom: '13px', display: 'flex', alignItems: 'center', gap: '7px',
            fontSize: '12px', fontWeight: 'bold',
          }}>
            <AlertCircle size={15} />
            {filteredData.length} {lang === 'th' ? 'สินค้าต่ำ' : 'low stock'}
          </div>
        )}

        {/* Search & Filter */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px', marginBottom: '13px',
        }}>
          <div style={{
            position: 'relative', display: 'flex', alignItems: 'center',
            background: 'white', borderRadius: '8px', border: '1px solid #E5DDD0',
          }}>
            <Search size={15} style={{ margin: '0 9px', color: '#C4925B' }} />
            <input type="text" placeholder={text.search} value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1, border: 'none', padding: '9px 7px', fontSize: '13px',
                fontFamily: 'inherit', outline: 'none',
              }} />
          </div>
          <select value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '9px 11px', borderRadius: '8px', border: '1px solid #E5DDD0',
              background: 'white', color: '#725446', fontFamily: 'inherit',
              fontSize: '13px', cursor: 'pointer',
            }}>
            <option value="all">{text.all_items}</option>
            {getCategories().map((cat) => (
              <option key={cat} value={cat}>{getCategoryText(cat)}</option>
            ))}
          </select>
        </div>

        {/* Stock Grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '11px', marginBottom: '110px',
        }}>
          {filteredData.length > 0 ? (
            filteredData.map((item) => {
              const isLow = item.qty <= item.minAlert;
              const isEmpty = item.qty === 0;

              return (
                <div key={item.id} style={{
                  background: 'white', borderRadius: '10px', padding: '11px',
                  border: isEmpty ? '2px solid #FAD0E2' : isLow ? '2px solid #EFE4AC' : '1px solid #E5DDD0',
                  boxShadow: isEmpty || isLow ? '0 2px 8px rgba(196, 146, 91, 0.1)' : '0 1px 4px rgba(0,0,0,0.05)',
                }}>
                  {isEmpty && (
                    <div style={{
                      display: 'inline-block', background: '#FAD0E2', color: '#725446',
                      padding: '3px 7px', borderRadius: '4px', fontSize: '11px',
                      fontWeight: 'bold', marginBottom: '7px',
                    }}>🔴 {lang === 'th' ? 'หมด' : 'Out'}</div>
                  )}
                  {!isEmpty && isLow && (
                    <div style={{
                      display: 'inline-block', background: '#EFE4AC', color: '#725446',
                      padding: '3px 7px', borderRadius: '4px', fontSize: '11px',
                      fontWeight: 'bold', marginBottom: '7px',
                    }}>🟡 {lang === 'th' ? 'ต่ำ' : 'Low'}</div>
                  )}

                  <h4 style={{
                    margin: '5px 0 3px 0', fontSize: '13px', fontWeight: 'bold',
                    color: '#725446', lineHeight: '1.3',
                  }}>
                    {lang === 'th' ? item.name_th : item.name_en}
                  </h4>

                  <p style={{ margin: '2px 0 7px 0', fontSize: '11px', color: '#8B9D7F' }}>
                    {getCategoryText(item.category)}
                  </p>

                  <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px',
                    marginBottom: '9px', padding: '7px', background: '#FFFBF5',
                    borderRadius: '6px',
                  }}>
                    <div>
                      <p style={{ margin: '0 0 3px 0', color: '#8B9D7F', fontSize: '10px' }}>
                        {text.quantity}
                      </p>
                      <p style={{ margin: '0', fontWeight: 'bold', color: '#725446', fontSize: '14px' }}>
                        {item.qty} {getUnitText(item.unit)}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 3px 0', color: '#8B9D7F', fontSize: '10px' }}>
                        {text.min_alert}
                      </p>
                      <p style={{ margin: '0', fontWeight: 'bold', color: '#C4925B', fontSize: '13px' }}>
                        {item.minAlert}
                      </p>
                    </div>
                  </div>

                  <p style={{ margin: '5px 0 0 0', fontSize: '10px', color: '#8B9D7F', textAlign: 'right' }}>
                    {item.lastUpdatedTime}
                  </p>

                  {currentUser.role !== 'owner' && (
                    <div style={{
                      display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px', marginTop: '9px',
                    }}>
                      <button onClick={() => handleQtyChange(item.id, item.qty - 1)}
                        style={{
                          padding: '7px', border: 'none', borderRadius: '4px',
                          background: '#FAD0E2', color: '#725446', cursor: 'pointer',
                          fontWeight: 'bold', fontSize: '13px',
                        }}>−</button>
                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: '#F5F0E8', borderRadius: '4px', fontSize: '12px',
                        fontWeight: 'bold', color: '#725446',
                      }}>{item.qty}</div>
                      <button onClick={() => handleQtyChange(item.id, item.qty + 1)}
                        style={{
                          padding: '7px', border: 'none', borderRadius: '4px',
                          background: '#C7D9BD', color: '#725446', cursor: 'pointer',
                          fontWeight: 'bold', fontSize: '13px',
                        }}>+</button>
                    </div>
                  )}
                </div>);
            })
          ) : (
            <div style={{
              gridColumn: '1 / -1', textAlign: 'center', padding: '35px 20px', color: '#8B9D7F',
            }}>
              <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '0' }}>
                {currentUser.role === 'owner'
                  ? lang === 'th' ? 'ไม่มีสินค้าต่ำกว่าเกณฑ์' : 'No low stock'
                  : lang === 'th' ? 'ไม่พบสินค้า' : 'No items'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Section - Private Messages */}
      {currentUser && (
        <div style={{
          background: 'white', borderTop: '1px solid #E5DDD0',
          display: 'flex', flexDirection: 'column', maxHeight: '230px', flex: 'none',
        }}>
          <div style={{
            padding: '9px 16px', borderBottom: '1px solid #E5DDD0',
            display: 'flex', alignItems: 'center', gap: '7px',
            fontWeight: 'bold', color: '#725446', fontSize: '13px', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <MessageSquare size={15} /> {text.messages} ({getCurrentChatMessages().length})
            </div>
            {currentUser.role === 'owner' ? (
              <span style={{ fontSize: '10px', color: '#8B9D7F' }}>
                {activeTab === 'backoffice' ? text.from_backoffice : text.from_frontstore}
              </span>
            ) : (
              <span style={{ fontSize: '11px', color: '#8B9D7F' }}>{text.to_owner}</span>
            )}
          </div>

          <div style={{
            flex: 1, overflowY: 'auto', padding: '11px 16px', display: 'flex',
            flexDirection: 'column', gap: '7px',
          }}>
            {getCurrentChatMessages().length > 0 ? (
              getCurrentChatMessages().map((msg) => {
                const isOwnMessage = msg.from === currentUser.name;
                return (
                  <div key={msg.id} style={{
                    background: isOwnMessage ? '#E8F5E9' : '#F5F0E8',
                    padding: '9px 11px', borderRadius: '6px',
                    fontSize: '12px', borderLeft: `2px solid ${isOwnMessage ? '#C7D9BD' : '#C4925B'}`,
                    marginLeft: isOwnMessage ? '30px' : '0',
                  }}>
                    <p style={{
                      margin: '0 0 2px 0', fontWeight: 'bold', color: '#725446', fontSize: '11px',
                    }}>{msg.from} {isOwnMessage && <span style={{ fontSize: '10px', color: '#8B9D7F' }}>(You)</span>}</p>
                    <p style={{ margin: '0 0 2px 0', color: '#725446', wordWrap: 'break-word', fontSize: '12px' }}>
                      {msg.text}
                    </p>
                    <p style={{ margin: '0', fontSize: '10px', color: '#8B9D7F' }}>
                      {msg.time}
                    </p>
                  </div>
                );
              })
            ) : (
              <div style={{
                textAlign: 'center', color: '#8B9D7F', padding: '16px 11px', fontSize: '12px',
              }}>
                {text.no_messages}
              </div>
            )}
          </div>

          <div style={{
            padding: '9px 16px', borderTop: '1px solid #E5DDD0', display: 'flex', gap: '7px', flex: 'none',
          }}>
            <input type="text" placeholder={text.type_message} value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              style={{
                flex: 1, padding: '9px 11px', border: '1px solid #E5DDD0',
                borderRadius: '6px', fontSize: '12px', fontFamily: 'inherit', outline: 'none',
              }} />
            <button onClick={handleSendMessage} style={{
              padding: '9px 11px', border: 'none', borderRadius: '6px',
              background: '#C4925B', color: 'white', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockAppV35;

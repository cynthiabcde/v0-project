// 报警频率类型
export type AlertFrequencyType = "instant" | "polling";

// 报警状态类型
export interface AlertType {
  id: string;
  name: string;
  category: string;
  description?: string;
  defaultFrequency: AlertFrequencyType;
  supportsPolling?: boolean; // 是否支持轮询配置
}

// 轮询配置
export interface PollingConfig {
  startHours: number; // 开始告警的小时数（如5小时）
  intervalHours: number; // 告警间隔（如每1小时）
  stopConditions: string[]; // 停止条件
}

// 报警规则
export interface AlertRule {
  id: string;
  name: string;
  shopIds: string[];
  alertTypeId: string;
  alertTypeCategory: string;
  alertPersonIds: string[];
  customMessage: string;
  enabled: boolean;
  frequencyType: AlertFrequencyType;
  pollingConfig?: PollingConfig;
  createdAt: string;
  updatedAt: string;
}

// 系统人员
export interface SystemUser {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar?: string;
}

// 预设规则模板
export interface RuleTemplate {
  id: string;
  name: string;
  alertTypeId: string;
  frequencyType: AlertFrequencyType;
  pollingConfig?: PollingConfig;
  suggestedRoles: string[];
  defaultMessage: string;
  description: string;
}

// 报警状态分类
export const ALERT_CATEGORIES = {
  BASIC_VALIDATION: "基础校验类异常",
  GIFT_STATUS: "礼包状态异常",
  ORDER_STATUS: "订单状态流转异常",
  INTERFACE_CALLBACK: "接口&回调&服务异常",
  FALLBACK_BOUNDARY: "兜底&边界类异常",
  INVENTORY_RISK: "库存&业务风控类",
} as const;

// 人员角色
export const USER_ROLES = {
  GIFT_CONFIG: "礼包配置",
  OPERATION: "运营",
  DEVOPS: "运维",
  ON_DUTY: "值班",
  CUSTOMER_SERVICE: "客服",
  DEVELOPER: "开发",
  PRODUCT: "产品",
  TEST: "测试",
} as const;

// 所有可选报警状态
export const ALERT_TYPES: AlertType[] = [
  // 基础校验类异常
  { 
    id: "product_not_exist", 
    name: "抖店商品ID不在系统库", 
    category: ALERT_CATEGORIES.BASIC_VALIDATION, 
    description: "订单推送后校验失败，关联抖店商品ID未配置",
    defaultFrequency: "instant"
  },
  { 
    id: "cp_gift_id_empty", 
    name: "CP礼包ID为空", 
    category: ALERT_CATEGORIES.BASIC_VALIDATION,
    defaultFrequency: "instant"
  },
  { 
    id: "cp_gift_id_invalid", 
    name: "CP礼包ID格式错误", 
    category: ALERT_CATEGORIES.BASIC_VALIDATION,
    defaultFrequency: "instant"
  },
  { 
    id: "cp_gift_id_expired", 
    name: "CP礼包ID已失效", 
    category: ALERT_CATEGORIES.BASIC_VALIDATION,
    defaultFrequency: "instant"
  },
  { 
    id: "account_id_invalid", 
    name: "账号ID非法/不存在", 
    category: ALERT_CATEGORIES.BASIC_VALIDATION,
    defaultFrequency: "instant"
  },
  { 
    id: "role_id_invalid", 
    name: "角色ID非法/不存在", 
    category: ALERT_CATEGORIES.BASIC_VALIDATION,
    defaultFrequency: "instant"
  },
  { 
    id: "account_role_empty", 
    name: "账号/角色ID为空", 
    category: ALERT_CATEGORIES.BASIC_VALIDATION,
    defaultFrequency: "instant"
  },

  // 礼包状态异常
  { 
    id: "deprecated_gift_new_order", 
    name: "已作废礼包收到新订单", 
    category: ALERT_CATEGORIES.GIFT_STATUS, 
    description: "目标礼包状态为已作废，仍产生新下单订单，存在订单拦截异常",
    defaultFrequency: "instant"
  },

  // 订单状态流转异常
  { 
    id: "order_long_processing", 
    name: "订单长时间处于发放中", 
    category: ALERT_CATEGORIES.ORDER_STATUS, 
    description: "订单状态为【发放中】，累计时长达到设定阈值，支持轮询重复告警",
    defaultFrequency: "polling",
    supportsPolling: true
  },
  { 
    id: "order_timeout_12h", 
    name: "订单触发12小时超时", 
    category: ALERT_CATEGORIES.ORDER_STATUS, 
    description: "订单达到12小时超时阈值，系统标记为超时",
    defaultFrequency: "instant"
  },
  { 
    id: "order_distribute_failed", 
    name: "订单状态变为发放失败", 
    category: ALERT_CATEGORIES.ORDER_STATUS,
    description: "订单流转至【发放失败】，需核对用户账号/角色信息",
    defaultFrequency: "instant"
  },
  { 
    id: "auto_refund_failed", 
    name: "自动退款执行失败", 
    category: ALERT_CATEGORIES.ORDER_STATUS,
    defaultFrequency: "instant"
  },
  { 
    id: "refunding_long_time", 
    name: "退款中状态长时间未变更", 
    category: ALERT_CATEGORIES.ORDER_STATUS,
    defaultFrequency: "polling",
    supportsPolling: true
  },
  { 
    id: "manual_refund_failed", 
    name: "手动退款执行失败", 
    category: ALERT_CATEGORIES.ORDER_STATUS,
    description: "运营发起手动退款，接口/流程执行失败",
    defaultFrequency: "instant"
  },

  // 接口&回调&服务异常
  { 
    id: "pangu_recharge_failed", 
    name: "盘古充值接口调用失败", 
    category: ALERT_CATEGORIES.INTERFACE_CALLBACK,
    defaultFrequency: "instant"
  },
  { 
    id: "pangu_callback_failed", 
    name: "盘古回调接收失败", 
    category: ALERT_CATEGORIES.INTERFACE_CALLBACK,
    defaultFrequency: "instant"
  },
  { 
    id: "callback_retry_failed", 
    name: "回调接口多次重试仍失败", 
    category: ALERT_CATEGORIES.INTERFACE_CALLBACK,
    defaultFrequency: "instant"
  },

  // 兜底&边界类异常
  { 
    id: "timeout_auto_refund_failed", 
    name: "超时订单自动退款兜底失败", 
    category: ALERT_CATEGORIES.FALLBACK_BOUNDARY,
    description: "超时订单自动退款流程执行失败，需人工介入处理",
    defaultFrequency: "instant"
  },
  { 
    id: "duplicate_order_abnormal", 
    name: "重复拦截订单数量异常", 
    category: ALERT_CATEGORIES.FALLBACK_BOUNDARY, 
    description: "幂等拦截订单数量突增",
    defaultFrequency: "instant"
  },

  // 库存&业务风控类
  { 
    id: "zero_inventory_new_order", 
    name: "商品库存为0仍产生新订单", 
    category: ALERT_CATEGORIES.INVENTORY_RISK,
    defaultFrequency: "instant"
  },
];

// 模拟系统人员数据（按角色分组）
export const SYSTEM_USERS: SystemUser[] = [
  // 礼包配置
  { id: "user_1", name: "张三", role: USER_ROLES.GIFT_CONFIG, department: "运营部" },
  { id: "user_2", name: "李四", role: USER_ROLES.GIFT_CONFIG, department: "运营部" },
  // 运营
  { id: "user_3", name: "王五", role: USER_ROLES.OPERATION, department: "运营部" },
  { id: "user_4", name: "赵六", role: USER_ROLES.OPERATION, department: "运营部" },
  // 运维
  { id: "user_5", name: "钱七", role: USER_ROLES.DEVOPS, department: "技术部" },
  { id: "user_6", name: "孙八", role: USER_ROLES.DEVOPS, department: "技术部" },
  // 值班
  { id: "user_7", name: "周九", role: USER_ROLES.ON_DUTY, department: "技术部" },
  { id: "user_8", name: "吴十", role: USER_ROLES.ON_DUTY, department: "技术部" },
  // 客服
  { id: "user_9", name: "郑十一", role: USER_ROLES.CUSTOMER_SERVICE, department: "客服部" },
  { id: "user_10", name: "冯十二", role: USER_ROLES.CUSTOMER_SERVICE, department: "客服部" },
  // 开发
  { id: "user_11", name: "陈十三", role: USER_ROLES.DEVELOPER, department: "技术部" },
  { id: "user_12", name: "褚十四", role: USER_ROLES.DEVELOPER, department: "技术部" },
  // 产品
  { id: "user_13", name: "卫十五", role: USER_ROLES.PRODUCT, department: "产品部" },
  // 测试
  { id: "user_14", name: "蒋十六", role: USER_ROLES.TEST, department: "技术部" },
];

// 预设规则模板（7条标准规则）
export const RULE_TEMPLATES: RuleTemplate[] = [
  {
    id: "template_1",
    name: "商品ID未入库告警",
    alertTypeId: "product_not_exist",
    frequencyType: "instant",
    suggestedRoles: [USER_ROLES.GIFT_CONFIG, USER_ROLES.OPERATION],
    defaultMessage: "【店铺 {shopId}】新订单校验失败，关联抖店商品ID未入库，请尽快新建对应礼包并完成配置",
    description: "订单一进来就校验失败，属于配置遗漏，需要立刻提醒负责人补配礼包"
  },
  {
    id: "template_2",
    name: "CP礼包ID异常告警",
    alertTypeId: "cp_gift_id_invalid",
    frequencyType: "instant",
    suggestedRoles: [USER_ROLES.GIFT_CONFIG, USER_ROLES.OPERATION],
    defaultMessage: "【店铺 {shopId}】订单校验失败，CP礼包ID错误或已失效，请核查并修正礼包配置",
    description: "礼包基础配置错误，会导致批量下单失败，发现问题立即通知整改"
  },
  {
    id: "template_3",
    name: "订单充值超时轮询告警",
    alertTypeId: "order_long_processing",
    frequencyType: "polling",
    pollingConfig: {
      startHours: 5,
      intervalHours: 1,
      stopConditions: ["发放成功", "发放失败", "已退款", "退款中"]
    },
    suggestedRoles: [USER_ROLES.DEVOPS, USER_ROLES.ON_DUTY, USER_ROLES.OPERATION],
    defaultMessage: "【店铺 {shopId}】存在充值超时订单（已超 {duration} 小时），请跟进排查链路问题",
    description: "不等到12小时兜底，5小时提前预警，每小时重复提醒，订单状态流转后自动停止轮询"
  },
  {
    id: "template_4",
    name: "超时自动退款失败告警",
    alertTypeId: "timeout_auto_refund_failed",
    frequencyType: "instant",
    suggestedRoles: [USER_ROLES.OPERATION, USER_ROLES.DEVOPS, USER_ROLES.CUSTOMER_SERVICE],
    defaultMessage: "【店铺 {shopId}】超时订单自动退款失败，请人工介入处理，避免客诉",
    description: "自动兜底失效，属于严重异常，必须通知多方人员及时走手动退款补救"
  },
  {
    id: "template_5",
    name: "作废礼包新增订单告警",
    alertTypeId: "deprecated_gift_new_order",
    frequencyType: "instant",
    suggestedRoles: [USER_ROLES.GIFT_CONFIG, USER_ROLES.OPERATION],
    defaultMessage: "【店铺 {shopId}】已作废礼包收到新订单，存在订单拦截异常，请核查",
    description: "礼包状态【已作废】仍收到新下单订单，需检查订单拦截逻辑"
  },
  {
    id: "template_6",
    name: "订单发放失败告警",
    alertTypeId: "order_distribute_failed",
    frequencyType: "instant",
    suggestedRoles: [USER_ROLES.OPERATION, USER_ROLES.CUSTOMER_SERVICE],
    defaultMessage: "【店铺 {shopId}】产生发放失败订单，请核对用户账号/角色信息并做好客诉应对",
    description: "订单流转至【发放失败】，需及时核对信息并准备客诉应对"
  },
  {
    id: "template_7",
    name: "手动退款失败告警",
    alertTypeId: "manual_refund_failed",
    frequencyType: "instant",
    suggestedRoles: [USER_ROLES.DEVOPS, USER_ROLES.OPERATION],
    defaultMessage: "【店铺 {shopId}】手动退款操作失败，请排查接口及服务状态",
    description: "运营发起手动退款，接口/流程执行失败"
  },
];

// 模拟已有规则数据
export const MOCK_RULES: AlertRule[] = [
  {
    id: "rule_1",
    name: "商品ID未入库告警",
    shopIds: ["10001"],
    alertTypeId: "product_not_exist",
    alertTypeCategory: ALERT_CATEGORIES.BASIC_VALIDATION,
    alertPersonIds: ["user_1", "user_3"],
    customMessage: "【店铺 {shopId}】新订单校验失败，关联抖店商品ID未入库，请尽快新建对应礼包并完成配置",
    enabled: true,
    frequencyType: "instant",
    createdAt: "2024-03-01 10:30:00",
    updatedAt: "2024-03-15 14:20:00",
  },
  {
    id: "rule_2",
    name: "订单充值超时轮询告警",
    shopIds: ["10001", "10002"],
    alertTypeId: "order_long_processing",
    alertTypeCategory: ALERT_CATEGORIES.ORDER_STATUS,
    alertPersonIds: ["user_5", "user_7", "user_3"],
    customMessage: "【店铺 {shopId}】存在充值超时订单（已超 {duration} 小时），请跟进排查链路问题",
    enabled: true,
    frequencyType: "polling",
    pollingConfig: {
      startHours: 5,
      intervalHours: 1,
      stopConditions: ["发放成功", "发放失败", "已退款", "退款中"]
    },
    createdAt: "2024-03-05 09:15:00",
    updatedAt: "2024-03-18 11:45:00",
  },
  {
    id: "rule_3",
    name: "超时自动退款失败告警",
    shopIds: ["10001", "10002", "10003"],
    alertTypeId: "timeout_auto_refund_failed",
    alertTypeCategory: ALERT_CATEGORIES.FALLBACK_BOUNDARY,
    alertPersonIds: ["user_3", "user_5", "user_9"],
    customMessage: "【店铺 {shopId}】超时订单自动退款失败，请人工介入处理，避免客诉",
    enabled: true,
    frequencyType: "instant",
    createdAt: "2024-03-10 16:00:00",
    updatedAt: "2024-03-20 08:30:00",
  },
  {
    id: "rule_4",
    name: "作废礼包新增订单告警",
    shopIds: ["10001"],
    alertTypeId: "deprecated_gift_new_order",
    alertTypeCategory: ALERT_CATEGORIES.GIFT_STATUS,
    alertPersonIds: ["user_1", "user_2"],
    customMessage: "【店铺 {shopId}】已作废礼包收到新订单，存在订单拦截异常，请核查",
    enabled: false,
    frequencyType: "instant",
    createdAt: "2024-03-12 11:20:00",
    updatedAt: "2024-03-22 09:10:00",
  },
];

// 获取报警状态的分组数据
export function getAlertTypesByCategory() {
  const grouped: Record<string, AlertType[]> = {};
  
  ALERT_TYPES.forEach((type) => {
    if (!grouped[type.category]) {
      grouped[type.category] = [];
    }
    grouped[type.category].push(type);
  });
  
  return grouped;
}

// 根据ID获取报警类型
export function getAlertTypeById(id: string): AlertType | undefined {
  return ALERT_TYPES.find((type) => type.id === id);
}

// 根据ID获取用户
export function getUserById(id: string): SystemUser | undefined {
  return SYSTEM_USERS.find((user) => user.id === id);
}

// 根据ID数组获取用户名称
export function getUserNamesByIds(ids: string[]): string[] {
  return ids.map((id) => getUserById(id)?.name || id);
}

// 获取用户按角色分组
export function getUsersByRole() {
  const grouped: Record<string, SystemUser[]> = {};
  
  SYSTEM_USERS.forEach((user) => {
    if (!grouped[user.role]) {
      grouped[user.role] = [];
    }
    grouped[user.role].push(user);
  });
  
  return grouped;
}

// 获取规则模板
export function getRuleTemplateById(id: string): RuleTemplate | undefined {
  return RULE_TEMPLATES.find((t) => t.id === id);
}

// 获取规则模板按触发类型
export function getRuleTemplateByAlertTypeId(alertTypeId: string): RuleTemplate | undefined {
  return RULE_TEMPLATES.find((t) => t.alertTypeId === alertTypeId);
}

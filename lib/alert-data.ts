// 报警状态类型
export interface AlertType {
  id: string;
  name: string;
  category: string;
  description?: string;
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
  createdAt: string;
  updatedAt: string;
}

// 系统人员
export interface SystemUser {
  id: string;
  name: string;
  role: string;
  avatar?: string;
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

// 所有可选报警状态
export const ALERT_TYPES: AlertType[] = [
  // 基础校验类异常
  { id: "product_not_exist", name: "抖店商品ID不在系统库", category: ALERT_CATEGORIES.BASIC_VALIDATION, description: "订单推送后校验失败，关联抖店商品ID未配置" },
  { id: "cp_gift_id_empty", name: "CP礼包ID为空", category: ALERT_CATEGORIES.BASIC_VALIDATION },
  { id: "cp_gift_id_invalid", name: "CP礼包ID无效", category: ALERT_CATEGORIES.BASIC_VALIDATION },
  { id: "account_id_invalid", name: "账号ID非法/不存在", category: ALERT_CATEGORIES.BASIC_VALIDATION },
  { id: "role_id_invalid", name: "角色ID非法/不存在", category: ALERT_CATEGORIES.BASIC_VALIDATION },
  { id: "account_role_empty", name: "账号/角色ID为空", category: ALERT_CATEGORIES.BASIC_VALIDATION },

  // 礼包状态异常
  { id: "deprecated_gift_new_order", name: "已作废礼包收到新订单", category: ALERT_CATEGORIES.GIFT_STATUS, description: "目标礼包状态为已作废，仍产生新下单订单" },

  // 订单状态流转异常
  { id: "order_long_processing", name: "订单长时间处于发放中", category: ALERT_CATEGORIES.ORDER_STATUS, description: "未到12小时超时阈值，可自定义时长" },
  { id: "order_timeout_12h", name: "订单触发12小时超时", category: ALERT_CATEGORIES.ORDER_STATUS, description: "订单达到12小时超时，标记为超时" },
  { id: "order_distribute_failed", name: "订单状态变为发放失败", category: ALERT_CATEGORIES.ORDER_STATUS },
  { id: "auto_refund_failed", name: "自动退款执行失败", category: ALERT_CATEGORIES.ORDER_STATUS },
  { id: "refunding_long_time", name: "退款中状态长时间未变更", category: ALERT_CATEGORIES.ORDER_STATUS },
  { id: "manual_refund_failed", name: "手动退款执行失败", category: ALERT_CATEGORIES.ORDER_STATUS },

  // 接口&回调&服务异常
  { id: "pangu_recharge_failed", name: "盘古充值接口调用失败", category: ALERT_CATEGORIES.INTERFACE_CALLBACK },
  { id: "pangu_callback_failed", name: "盘古回调接收失败", category: ALERT_CATEGORIES.INTERFACE_CALLBACK },
  { id: "callback_retry_failed", name: "回调接口多次重试仍失败", category: ALERT_CATEGORIES.INTERFACE_CALLBACK },

  // 兜底&边界类异常
  { id: "timeout_auto_refund_failed", name: "超时订单自动退款兜底失败", category: ALERT_CATEGORIES.FALLBACK_BOUNDARY },
  { id: "duplicate_order_abnormal", name: "重复拦截订单数量异常", category: ALERT_CATEGORIES.FALLBACK_BOUNDARY, description: "幂等拦截订单数量突增" },

  // 库存&业务风控类
  { id: "zero_inventory_new_order", name: "商品库存为0仍产生新订单", category: ALERT_CATEGORIES.INVENTORY_RISK },
];

// 模拟系统人员数据
export const SYSTEM_USERS: SystemUser[] = [
  { id: "user_1", name: "运营A", role: "运营" },
  { id: "user_2", name: "运维B", role: "运维" },
  { id: "user_3", name: "测试C", role: "测试" },
  { id: "user_4", name: "产品D", role: "产品" },
  { id: "user_5", name: "开发E", role: "开发" },
  { id: "user_6", name: "客服F", role: "客服" },
  { id: "user_7", name: "运营G", role: "运营" },
  { id: "user_8", name: "运维H", role: "运维" },
];

// 模拟已有规则数据
export const MOCK_RULES: AlertRule[] = [
  {
    id: "rule_1",
    name: "商品ID异常监控",
    shopIds: ["10001"],
    alertTypeId: "product_not_exist",
    alertTypeCategory: ALERT_CATEGORIES.BASIC_VALIDATION,
    alertPersonIds: ["user_1", "user_2"],
    customMessage: "【店铺10001】订单校验失败，关联抖店商品ID未配置，请尽快核查",
    enabled: true,
    createdAt: "2024-03-01 10:30:00",
    updatedAt: "2024-03-15 14:20:00",
  },
  {
    id: "rule_2",
    name: "订单超时告警",
    shopIds: ["10002"],
    alertTypeId: "order_timeout_12h",
    alertTypeCategory: ALERT_CATEGORIES.ORDER_STATUS,
    alertPersonIds: ["user_3", "user_1"],
    customMessage: "【店铺10002】存在充值超时订单，系统已启动自动退款兜底",
    enabled: true,
    createdAt: "2024-03-05 09:15:00",
    updatedAt: "2024-03-18 11:45:00",
  },
  {
    id: "rule_3",
    name: "礼包作废风险监控",
    shopIds: ["10001", "10003"],
    alertTypeId: "deprecated_gift_new_order",
    alertTypeCategory: ALERT_CATEGORIES.GIFT_STATUS,
    alertPersonIds: ["user_1", "user_4"],
    customMessage: "【店铺{shopId}】已作废礼包收到新订单，存在业务风险",
    enabled: false,
    createdAt: "2024-03-10 16:00:00",
    updatedAt: "2024-03-20 08:30:00",
  },
  {
    id: "rule_4",
    name: "盘古接口异常监控",
    shopIds: ["10001", "10002", "10003"],
    alertTypeId: "pangu_recharge_failed",
    alertTypeCategory: ALERT_CATEGORIES.INTERFACE_CALLBACK,
    alertPersonIds: ["user_2", "user_5"],
    customMessage: "【紧急】盘古充值接口调用失败，请立即排查",
    enabled: true,
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

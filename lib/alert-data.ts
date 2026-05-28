// 报警状态类型
export interface AlertType {
  id: string;
  name: string;
  category: string;
}

// 报警规则
export interface AlertRule {
  id: string;
  name: string;
  shopIds: string[];
  triggerStatuses: string[];
  alertUserIds: string[];
  alertMessage: string;
  enabled: boolean;
  deprecated: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

// 系统人员
export interface SystemUser {
  id: string;
  name: string;
}

// 所有可选报警状态
export const ALERT_TYPES: AlertType[] = [
  // 基础校验类
  { id: "PRODUCT_NOT_FOUND", name: "商品ID不在库中", category: "基础校验类" },
  { id: "GIFT_PACK_NOT_FOUND", name: "礼包未找到", category: "基础校验类" },
  { id: "CP_GIFT_ID_EMPTY", name: "CP礼包ID为空", category: "基础校验类" },
  { id: "CP_GIFT_ID_INVALID", name: "CP礼包ID格式错误", category: "基础校验类" },
  { id: "ACCOUNT_ID_INVALID", name: "账号ID非法/不存在", category: "基础校验类" },
  { id: "ROLE_ID_INVALID", name: "角色ID非法/不存在", category: "基础校验类" },
  
  // 订单状态异常
  { id: "ORDER_TIMEOUT", name: "订单超时未处理", category: "订单状态异常" },
  { id: "ORDER_LONG_PROCESSING", name: "订单长时间处于发放中", category: "订单状态异常" },
  { id: "ORDER_DISTRIBUTE_FAILED", name: "订单发放失败", category: "订单状态异常" },
  { id: "AUTO_REFUND_FAILED", name: "自动退款执行失败", category: "订单状态异常" },
  { id: "MANUAL_REFUND_FAILED", name: "手动退款执行失败", category: "订单状态异常" },
  
  // 礼包状态异常
  { id: "GIFT_PACK_EMPTY", name: "礼包库存为空", category: "礼包状态异常" },
  { id: "GIFT_PACK_LOW_STOCK", name: "礼包库存不足", category: "礼包状态异常" },
  { id: "DEPRECATED_GIFT_NEW_ORDER", name: "已作废礼包收到新订单", category: "礼包状态异常" },
  
  // 接口异常
  { id: "API_CALL_FAILED", name: "接口调用失败", category: "接口异常" },
  { id: "CALLBACK_FAILED", name: "回调接收失败", category: "接口异常" },
];

// 系统人员列表（纯人名列表）
export const SYSTEM_USERS: SystemUser[] = [
  { id: "1", name: "张三" },
  { id: "2", name: "李四" },
  { id: "3", name: "王五" },
  { id: "4", name: "赵六" },
  { id: "5", name: "钱七" },
  { id: "6", name: "孙八" },
  { id: "7", name: "周九" },
  { id: "8", name: "吴十" },
];

// 示例数据
export const SAMPLE_RULES: AlertRule[] = [
  {
    id: "10001",
    name: "商品校验告警",
    shopIds: ["SHOP001", "SHOP002"],
    triggerStatuses: ["PRODUCT_NOT_FOUND", "GIFT_PACK_NOT_FOUND"],
    alertUserIds: ["1", "3"],
    alertMessage: "商品或礼包未找到，请及时处理",
    enabled: true,
    deprecated: false,
    createdAt: "2024-07-10 09:35:31",
    createdBy: "系统管理员11",
    updatedAt: "2024-07-10 09:35:31",
    updatedBy: "系统管理员11",
  },
  {
    id: "10002",
    name: "订单超时告警",
    shopIds: ["SHOP003"],
    triggerStatuses: ["ORDER_TIMEOUT", "ORDER_LONG_PROCESSING"],
    alertUserIds: ["2", "4"],
    alertMessage: "订单处理超时，请检查订单状态",
    enabled: false,
    deprecated: false,
    createdAt: "2024-07-09 16:35:01",
    createdBy: "系统管理员11",
    updatedAt: "2024-07-09 16:35:01",
    updatedBy: "系统管理员11",
  },
  {
    id: "10003",
    name: "库存不足预警",
    shopIds: ["SHOP001"],
    triggerStatuses: ["GIFT_PACK_EMPTY", "GIFT_PACK_LOW_STOCK"],
    alertUserIds: ["1", "5"],
    alertMessage: "礼包库存不足，请及时补充",
    enabled: false,
    deprecated: true,
    createdAt: "2024-07-08 14:22:07",
    createdBy: "余茶admin",
    updatedAt: "2024-07-08 14:22:07",
    updatedBy: "余茶admin",
  },
];

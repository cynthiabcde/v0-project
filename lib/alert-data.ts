// 报警状态分类
export const ALERT_STATUS_CATEGORIES = [
  {
    category: '基础校验类',
    statuses: [
      { id: 'PRODUCT_NOT_FOUND', label: '商品ID不在库中' },
      { id: 'GIFT_PACK_NOT_FOUND', label: '礼包未找到' },
      { id: 'GIFT_PACK_EXPIRED', label: '礼包已过期' },
      { id: 'GIFT_PACK_DISABLED', label: '礼包已禁用' },
    ],
  },
  {
    category: '礼包状态异常',
    statuses: [
      { id: 'GIFT_PACK_EMPTY', label: '礼包库存为空' },
      { id: 'GIFT_PACK_LOW_STOCK', label: '礼包库存不足' },
      { id: 'DEPRECATED_GIFT_NEW_ORDER', label: '已作废礼包收到新订单' },
    ],
  },
  {
    category: '订单状态流转异常',
    statuses: [
      { id: 'ORDER_TIMEOUT', label: '订单超时未处理' },
      { id: 'ORDER_LONG_PROCESSING', label: '订单长时间处于发放中' },
      { id: 'ORDER_DISTRIBUTE_FAILED', label: '订单发放失败' },
      { id: 'ORDER_CALLBACK_FAILED', label: '订单回调失败' },
    ],
  },
  {
    category: '接口异常',
    statuses: [
      { id: 'API_TIMEOUT', label: '接口超时' },
      { id: 'API_ERROR', label: '接口错误' },
      { id: 'REFUND_FAILED', label: '退款执行失败' },
    ],
  },
]

// 系统人员列表
export const SYSTEM_USERS = [
  { id: '1', name: '张三', role: '运营' },
  { id: '2', name: '李四', role: '运营' },
  { id: '3', name: '王五', role: '技术' },
  { id: '4', name: '赵六', role: '技术' },
  { id: '5', name: '钱七', role: '客服' },
  { id: '6', name: '孙八', role: '客服' },
  { id: '7', name: '周九', role: '管理员' },
  { id: '8', name: '吴十', role: '管理员' },
]

// 报警规则类型
export interface AlertRule {
  id: string
  name: string
  shopIds: string[]
  triggerStatuses: string[]
  alertUserIds: string[]
  alertMessage: string
  enabled: boolean
  deprecated: boolean // 是否已作废
  createdAt: string
  createdBy: string
  updatedAt: string
  updatedBy: string
}

// 示例数据
export const SAMPLE_RULES: AlertRule[] = [
  {
    id: '10001',
    name: '商品校验告警',
    shopIds: ['SHOP001', 'SHOP002'],
    triggerStatuses: ['PRODUCT_NOT_FOUND', 'GIFT_PACK_NOT_FOUND'],
    alertUserIds: ['1', '3'],
    alertMessage: '商品或礼包未找到，请及时处理',
    enabled: true,
    deprecated: false,
    createdAt: '2024-07-10 09:35:31',
    createdBy: '系统管理员11',
    updatedAt: '2024-07-10 09:35:31',
    updatedBy: '系统管理员11',
  },
  {
    id: '10002',
    name: '订单超时告警',
    shopIds: ['SHOP003'],
    triggerStatuses: ['ORDER_TIMEOUT', 'ORDER_LONG_PROCESSING'],
    alertUserIds: ['2', '4'],
    alertMessage: '订单处理超时，请检查订单状态',
    enabled: false,
    deprecated: false,
    createdAt: '2024-07-09 16:35:01',
    createdBy: '系统管理员11',
    updatedAt: '2024-07-09 16:35:01',
    updatedBy: '系统管理员11',
  },
  {
    id: '10003',
    name: '库存不足预警',
    shopIds: ['SHOP001'],
    triggerStatuses: ['GIFT_PACK_EMPTY', 'GIFT_PACK_LOW_STOCK'],
    alertUserIds: ['1', '5'],
    alertMessage: '礼包库存不足，请及时补充',
    enabled: false,
    deprecated: true,
    createdAt: '2024-07-08 14:22:07',
    createdBy: '余茶admin',
    updatedAt: '2024-07-08 14:22:07',
    updatedBy: '余茶admin',
  },
]

// 获取状态标签
export function getStatusLabel(statusId: string): string {
  for (const category of ALERT_STATUS_CATEGORIES) {
    const status = category.statuses.find((s) => s.id === statusId)
    if (status) return status.label
  }
  return statusId
}

// 获取用户名称
export function getUserName(userId: string): string {
  const user = SYSTEM_USERS.find((u) => u.id === userId)
  return user ? user.name : userId
}

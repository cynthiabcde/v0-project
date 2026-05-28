"use client"

import { useEffect, useState } from "react"
import { X, Plus, ChevronDown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {
  type AlertRule,
  ALERT_STATUS_CATEGORIES,
  SYSTEM_USERS,
  getStatusLabel,
} from "@/lib/alert-data"

interface AlertRuleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rule: AlertRule | null
  onSave: (rule: AlertRule) => void
}

export function AlertRuleDialog({
  open,
  onOpenChange,
  rule,
  onSave,
}: AlertRuleDialogProps) {
  const [name, setName] = useState("")
  const [shopIds, setShopIds] = useState<string[]>([])
  const [shopIdInput, setShopIdInput] = useState("")
  const [triggerStatuses, setTriggerStatuses] = useState<string[]>([])
  const [alertUserIds, setAlertUserIds] = useState<string[]>([])
  const [alertMessage, setAlertMessage] = useState("")
  const [statusOpen, setStatusOpen] = useState(false)
  const [personOpen, setPersonOpen] = useState(false)

  useEffect(() => {
    if (rule) {
      setName(rule.name)
      setShopIds(rule.shopIds)
      setTriggerStatuses(rule.triggerStatuses)
      setAlertUserIds(rule.alertUserIds)
      setAlertMessage(rule.alertMessage)
    } else {
      setName("")
      setShopIds([])
      setTriggerStatuses([])
      setAlertUserIds([])
      setAlertMessage("")
    }
    setShopIdInput("")
  }, [rule, open])

  const handleAddShopId = () => {
    const trimmed = shopIdInput.trim()
    if (trimmed && !shopIds.includes(trimmed)) {
      setShopIds([...shopIds, trimmed])
      setShopIdInput("")
    }
  }

  const handleRemoveShopId = (id: string) => {
    setShopIds(shopIds.filter((s) => s !== id))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddShopId()
    }
  }

  const toggleStatus = (statusId: string) => {
    setTriggerStatuses((prev) =>
      prev.includes(statusId)
        ? prev.filter((id) => id !== statusId)
        : [...prev, statusId]
    )
  }

  const togglePerson = (personId: string) => {
    setAlertUserIds((prev) =>
      prev.includes(personId)
        ? prev.filter((id) => id !== personId)
        : [...prev, personId]
    )
  }

  const handleSave = () => {
    if (
      !name.trim() ||
      shopIds.length === 0 ||
      triggerStatuses.length === 0 ||
      alertUserIds.length === 0
    ) {
      return
    }

    const now = new Date()
      .toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(/\//g, "-")

    const newRule: AlertRule = {
      id: rule?.id || "",
      name: name.trim(),
      shopIds,
      triggerStatuses,
      alertUserIds,
      alertMessage:
        alertMessage.trim() ||
        `【店铺{shopId}】${triggerStatuses.map((s) => getStatusLabel(s)).join("、")}，请及时处理`,
      enabled: rule?.enabled ?? true,
      createdAt: rule?.createdAt || now,
      createdBy: rule?.createdBy || "当前用户",
      updatedAt: now,
      updatedBy: "当前用户",
    }

    onSave(newRule)
  }

  const isValid =
    name.trim() &&
    shopIds.length > 0 &&
    triggerStatuses.length > 0 &&
    alertUserIds.length > 0

  // 按角色分组用户
  const usersByRole = SYSTEM_USERS.reduce(
    (acc, user) => {
      if (!acc[user.role]) {
        acc[user.role] = []
      }
      acc[user.role].push(user)
      return acc
    },
    {} as Record<string, typeof SYSTEM_USERS>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white">
        <DialogHeader className="border-b border-[#e8e8e8] pb-4">
          <DialogTitle className="text-[#333] text-base font-medium">
            {rule ? "编辑报警规则" : "新建报警规则"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 规则名称 */}
          <div className="flex items-center gap-4">
            <Label htmlFor="rule-name" className="w-20 text-right text-sm text-[#333] shrink-0">
              规则名称 <span className="text-[#ff4d4f]">*</span>
            </Label>
            <Input
              id="rule-name"
              placeholder="请输入规则名称"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 h-8 text-sm border-[#d9d9d9] rounded"
            />
          </div>

          {/* 店铺ID */}
          <div className="flex items-start gap-4">
            <Label className="w-20 text-right text-sm text-[#333] shrink-0 pt-1">
              店铺ID <span className="text-[#ff4d4f]">*</span>
            </Label>
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="输入店铺ID后按回车添加"
                  value={shopIdInput}
                  onChange={(e) => setShopIdInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 h-8 text-sm border-[#d9d9d9] rounded"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddShopId}
                  className="h-8 px-3 border-[#d9d9d9]"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {shopIds.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {shopIds.map((id) => (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#fafafa] border border-[#d9d9d9] rounded text-xs text-[#333]"
                    >
                      {id}
                      <button
                        type="button"
                        onClick={() => handleRemoveShopId(id)}
                        className="text-[#999] hover:text-[#333]"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 触发状态 */}
          <div className="flex items-start gap-4">
            <Label className="w-20 text-right text-sm text-[#333] shrink-0 pt-1">
              触发状态 <span className="text-[#ff4d4f]">*</span>
            </Label>
            <div className="flex-1 space-y-2">
              <Popover open={statusOpen} onOpenChange={setStatusOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full h-8 px-3 border border-[#d9d9d9] rounded bg-white text-sm text-left flex items-center justify-between"
                  >
                    {triggerStatuses.length > 0 ? (
                      <span className="text-[#333]">已选择 {triggerStatuses.length} 个状态</span>
                    ) : (
                      <span className="text-[#999]">请选择触发状态...</span>
                    )}
                    <ChevronDown className="h-4 w-4 text-[#999]" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[350px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="搜索状态..." className="text-sm" />
                    <CommandList className="max-h-[200px]">
                      <CommandEmpty>未找到匹配的状态</CommandEmpty>
                      {ALERT_STATUS_CATEGORIES.map((category) => (
                        <CommandGroup key={category.category} heading={category.category}>
                          {category.statuses.map((status) => (
                            <CommandItem
                              key={status.id}
                              value={status.label}
                              onSelect={() => toggleStatus(status.id)}
                              className="text-sm"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  triggerStatuses.includes(status.id)
                                    ? "opacity-100 text-[#1890ff]"
                                    : "opacity-0"
                                )}
                              />
                              {status.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {triggerStatuses.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {triggerStatuses.map((statusId) => (
                    <span
                      key={statusId}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#e6f7ff] border border-[#91d5ff] rounded text-xs text-[#1890ff]"
                    >
                      {getStatusLabel(statusId)}
                      <button
                        type="button"
                        onClick={() => toggleStatus(statusId)}
                        className="text-[#1890ff] hover:text-[#096dd9]"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 报警人员 */}
          <div className="flex items-start gap-4">
            <Label className="w-20 text-right text-sm text-[#333] shrink-0 pt-1">
              报警人员 <span className="text-[#ff4d4f]">*</span>
            </Label>
            <div className="flex-1 space-y-2">
              <Popover open={personOpen} onOpenChange={setPersonOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full h-8 px-3 border border-[#d9d9d9] rounded bg-white text-sm text-left flex items-center justify-between"
                  >
                    {alertUserIds.length > 0 ? (
                      <span className="text-[#333]">已选择 {alertUserIds.length} 人</span>
                    ) : (
                      <span className="text-[#999]">请选择报警人员...</span>
                    )}
                    <ChevronDown className="h-4 w-4 text-[#999]" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="搜索人员..." className="text-sm" />
                    <CommandList className="max-h-[200px]">
                      <CommandEmpty>未找到匹配的人员</CommandEmpty>
                      {Object.entries(usersByRole).map(([role, users]) => (
                        <CommandGroup key={role} heading={role}>
                          {users.map((user) => (
                            <CommandItem
                              key={user.id}
                              value={user.name}
                              onSelect={() => togglePerson(user.id)}
                              className="text-sm"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  alertUserIds.includes(user.id)
                                    ? "opacity-100 text-[#1890ff]"
                                    : "opacity-0"
                                )}
                              />
                              {user.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {alertUserIds.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {alertUserIds.map((userId) => {
                    const user = SYSTEM_USERS.find((u) => u.id === userId)
                    return (
                      <span
                        key={userId}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#fafafa] border border-[#d9d9d9] rounded text-xs text-[#333]"
                      >
                        {user?.name || userId}
                        <button
                          type="button"
                          onClick={() => togglePerson(userId)}
                          className="text-[#999] hover:text-[#333]"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 报警提示语 */}
          <div className="flex items-start gap-4">
            <Label htmlFor="alert-message" className="w-20 text-right text-sm text-[#333] shrink-0 pt-1">
              报警提示语
            </Label>
            <div className="flex-1">
              <Textarea
                id="alert-message"
                placeholder="自定义报警提示语（可选，留空将自动生成）"
                value={alertMessage}
                onChange={(e) => setAlertMessage(e.target.value)}
                rows={3}
                className="text-sm border-[#d9d9d9] rounded resize-none"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-[#e8e8e8] pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-8 px-4 border-[#d9d9d9] text-[#333] hover:border-[#1890ff] hover:text-[#1890ff]"
          >
            取消
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isValid}
            className="h-8 px-4 bg-[#1890ff] hover:bg-[#40a9ff] text-white"
          >
            {rule ? "保存" : "创建"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

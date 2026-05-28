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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{rule ? "编辑报警规则" : "新建报警规则"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 规则名称 */}
          <div className="space-y-2">
            <Label htmlFor="rule-name">
              规则名称 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="rule-name"
              placeholder="请输入规则名称"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* 店铺ID */}
          <div className="space-y-2">
            <Label>
              店铺ID <span className="text-destructive">*</span>
              <span className="text-muted-foreground text-xs ml-2">
                （支持多选）
              </span>
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="输入店铺ID后按回车添加"
                value={shopIdInput}
                onChange={(e) => setShopIdInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={handleAddShopId}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {shopIds.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {shopIds.map((id) => (
                  <Badge key={id} variant="secondary" className="gap-1 pr-1">
                    {id}
                    <button
                      type="button"
                      onClick={() => handleRemoveShopId(id)}
                      className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* 触发状态 */}
          <div className="space-y-2">
            <Label>
              触发状态 <span className="text-destructive">*</span>
              <span className="text-muted-foreground text-xs ml-2">
                （支持多选）
              </span>
            </Label>
            <Popover open={statusOpen} onOpenChange={setStatusOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={statusOpen}
                  className="w-full justify-between font-normal"
                >
                  {triggerStatuses.length > 0 ? (
                    <span className="truncate">
                      已选择 {triggerStatuses.length} 个状态
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      请选择触发状态...
                    </span>
                  )}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="搜索状态..." />
                  <CommandList className="max-h-[250px]">
                    <CommandEmpty>未找到匹配的状态</CommandEmpty>
                    {ALERT_STATUS_CATEGORIES.map((category) => (
                      <CommandGroup key={category.category} heading={category.category}>
                        {category.statuses.map((status) => (
                          <CommandItem
                            key={status.id}
                            value={status.label}
                            onSelect={() => toggleStatus(status.id)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                triggerStatuses.includes(status.id)
                                  ? "opacity-100"
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
              <div className="flex flex-wrap gap-2">
                {triggerStatuses.map((statusId) => (
                  <Badge key={statusId} variant="secondary" className="gap-1 pr-1">
                    {getStatusLabel(statusId)}
                    <button
                      type="button"
                      onClick={() => toggleStatus(statusId)}
                      className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* 报警人员 */}
          <div className="space-y-2">
            <Label>
              报警人员 <span className="text-destructive">*</span>
              <span className="text-muted-foreground text-xs ml-2">
                （支持多选）
              </span>
            </Label>
            <Popover open={personOpen} onOpenChange={setPersonOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={personOpen}
                  className="w-full justify-between font-normal"
                >
                  {alertUserIds.length > 0 ? (
                    <span className="truncate">
                      已选择 {alertUserIds.length} 人
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      请选择报警人员...
                    </span>
                  )}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="搜索人员..." />
                  <CommandList className="max-h-[250px]">
                    <CommandEmpty>未找到匹配的人员</CommandEmpty>
                    {Object.entries(usersByRole).map(([role, users]) => (
                      <CommandGroup key={role} heading={role}>
                        {users.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={user.name}
                            onSelect={() => togglePerson(user.id)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                alertUserIds.includes(user.id)
                                  ? "opacity-100"
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
              <div className="flex flex-wrap gap-2">
                {alertUserIds.map((userId) => {
                  const user = SYSTEM_USERS.find((u) => u.id === userId)
                  return (
                    <Badge key={userId} variant="secondary" className="gap-1 pr-1">
                      {user?.name || userId}
                      <button
                        type="button"
                        onClick={() => togglePerson(userId)}
                        className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )
                })}
              </div>
            )}
          </div>

          {/* 报警提示语 */}
          <div className="space-y-2">
            <Label htmlFor="alert-message">报警提示语</Label>
            <Textarea
              id="alert-message"
              placeholder="自定义报警提示语（可选）"
              value={alertMessage}
              onChange={(e) => setAlertMessage(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              留空将自动生成默认提示语
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            {rule ? "保存" : "创建"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

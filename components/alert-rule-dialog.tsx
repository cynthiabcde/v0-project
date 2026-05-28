"use client";

import { useEffect, useState } from "react";
import { X, Plus, ChevronDown, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { AlertRule, ALERT_TYPES, SYSTEM_USERS } from "@/lib/alert-data";

interface AlertRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule: AlertRule | null;
  onSave: (rule: AlertRule) => void;
}

export function AlertRuleDialog({ open, onOpenChange, rule, onSave }: AlertRuleDialogProps) {
  const [name, setName] = useState("");
  const [shopIds, setShopIds] = useState<string[]>([]);
  const [shopIdInput, setShopIdInput] = useState("");
  const [triggerStatuses, setTriggerStatuses] = useState<string[]>([]);
  const [alertUserIds, setAlertUserIds] = useState<string[]>([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);
  const [personOpen, setPersonOpen] = useState(false);

  useEffect(() => {
    if (rule) {
      setName(rule.name);
      setShopIds(rule.shopIds);
      setTriggerStatuses(rule.triggerStatuses);
      setAlertUserIds(rule.alertUserIds);
      setAlertMessage(rule.alertMessage);
    } else {
      setName("");
      setShopIds([]);
      setTriggerStatuses([]);
      setAlertUserIds([]);
      setAlertMessage("");
    }
    setShopIdInput("");
  }, [rule, open]);

  const handleAddShopId = () => {
    const trimmed = shopIdInput.trim();
    if (trimmed && !shopIds.includes(trimmed)) {
      setShopIds([...shopIds, trimmed]);
      setShopIdInput("");
    }
  };

  const handleRemoveShopId = (id: string) => {
    setShopIds(shopIds.filter((s) => s !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddShopId();
    }
  };

  const toggleStatus = (statusId: string) => {
    setTriggerStatuses((prev) =>
      prev.includes(statusId)
        ? prev.filter((id) => id !== statusId)
        : [...prev, statusId]
    );
  };

  const togglePerson = (personId: string) => {
    setAlertUserIds((prev) =>
      prev.includes(personId)
        ? prev.filter((id) => id !== personId)
        : [...prev, personId]
    );
  };

  const handleSave = () => {
    if (!name.trim() || shopIds.length === 0 || triggerStatuses.length === 0 || alertUserIds.length === 0) {
      return;
    }

    const now = new Date().toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).replace(/\//g, "-");

    const newRule: AlertRule = {
      id: rule?.id || "",
      name: name.trim(),
      shopIds,
      triggerStatuses,
      alertUserIds,
      alertMessage: alertMessage.trim(),
      enabled: rule?.enabled ?? true,
      deprecated: rule?.deprecated ?? false,
      createdAt: rule?.createdAt || now,
      createdBy: rule?.createdBy || "系统管理员11",
      updatedAt: now,
      updatedBy: "系统管理员11",
    };

    onSave(newRule);
  };

  const isValid =
    name.trim() &&
    shopIds.length > 0 &&
    triggerStatuses.length > 0 &&
    alertUserIds.length > 0;

  const getStatusName = (statusId: string) => {
    const status = ALERT_TYPES.find((s) => s.id === statusId);
    return status?.name || statusId;
  };

  const getUserName = (userId: string) => {
    const user = SYSTEM_USERS.find((u) => u.id === userId);
    return user?.name || userId;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-[#f0f0f0]">
          <DialogTitle className="text-base font-medium text-[#333]">
            {rule ? "编辑报警规则" : "新建报警规则"}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-6 space-y-5">
          {/* 规则名称 */}
          <div className="flex items-start gap-4">
            <label className="w-20 text-right text-sm text-[#333] pt-1.5 shrink-0">
              规则名称 <span className="text-[#ff4d4f]">*</span>
            </label>
            <input
              type="text"
              placeholder="请输入规则名称"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 h-8 px-3 border border-[#d9d9d9] rounded text-sm focus:border-[#1890ff] focus:outline-none focus:ring-1 focus:ring-[#1890ff]/20"
            />
          </div>

          {/* 店铺ID */}
          <div className="flex items-start gap-4">
            <label className="w-20 text-right text-sm text-[#333] pt-1.5 shrink-0">
              店铺ID <span className="text-[#ff4d4f]">*</span>
            </label>
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="输入店铺ID后按回车添加"
                  value={shopIdInput}
                  onChange={(e) => setShopIdInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 h-8 px-3 border border-[#d9d9d9] rounded text-sm focus:border-[#1890ff] focus:outline-none focus:ring-1 focus:ring-[#1890ff]/20"
                />
                <button
                  type="button"
                  onClick={handleAddShopId}
                  className="w-8 h-8 flex items-center justify-center border border-[#d9d9d9] rounded hover:border-[#1890ff] hover:text-[#1890ff]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {shopIds.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {shopIds.map((id) => (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#fafafa] border border-[#d9d9d9] rounded text-sm text-[#333]"
                    >
                      {id}
                      <button
                        type="button"
                        onClick={() => handleRemoveShopId(id)}
                        className="text-[#999] hover:text-[#333]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 触发状态 */}
          <div className="flex items-start gap-4">
            <label className="w-20 text-right text-sm text-[#333] pt-1.5 shrink-0">
              触发状态 <span className="text-[#ff4d4f]">*</span>
            </label>
            <div className="flex-1 space-y-2">
              <Popover open={statusOpen} onOpenChange={setStatusOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full h-8 px-3 border border-[#d9d9d9] rounded text-sm text-left flex items-center justify-between hover:border-[#1890ff]"
                  >
                    {triggerStatuses.length > 0 ? (
                      <span className="text-[#333]">已选择 {triggerStatuses.length} 个状态</span>
                    ) : (
                      <span className="text-[#bfbfbf]">请选择触发状态</span>
                    )}
                    <ChevronDown className="w-4 h-4 text-[#999]" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="搜索状态..." className="text-sm" />
                    <CommandList className="max-h-[240px]">
                      <CommandEmpty>未找到匹配的状态</CommandEmpty>
                      {ALERT_TYPES.map((status) => (
                        <CommandItem
                          key={status.id}
                          value={status.name}
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
                          {status.name}
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {triggerStatuses.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {triggerStatuses.map((statusId) => (
                    <span
                      key={statusId}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#e6f7ff] border border-[#91d5ff] rounded text-sm text-[#1890ff]"
                    >
                      {getStatusName(statusId)}
                      <button
                        type="button"
                        onClick={() => toggleStatus(statusId)}
                        className="text-[#1890ff] hover:text-[#096dd9]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 报警人员 */}
          <div className="flex items-start gap-4">
            <label className="w-20 text-right text-sm text-[#333] pt-1.5 shrink-0">
              报警人员 <span className="text-[#ff4d4f]">*</span>
            </label>
            <div className="flex-1 space-y-2">
              <Popover open={personOpen} onOpenChange={setPersonOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full h-8 px-3 border border-[#d9d9d9] rounded text-sm text-left flex items-center justify-between hover:border-[#1890ff]"
                  >
                    {alertUserIds.length > 0 ? (
                      <span className="text-[#333]">已选择 {alertUserIds.length} 人</span>
                    ) : (
                      <span className="text-[#bfbfbf]">请选择报警人员</span>
                    )}
                    <ChevronDown className="w-4 h-4 text-[#999]" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="搜索人员..." className="text-sm" />
                    <CommandList className="max-h-[200px]">
                      <CommandEmpty>未找到匹配的人员</CommandEmpty>
                      {SYSTEM_USERS.map((user) => (
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
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {alertUserIds.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {alertUserIds.map((userId) => (
                    <span
                      key={userId}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#fafafa] border border-[#d9d9d9] rounded text-sm text-[#333]"
                    >
                      {getUserName(userId)}
                      <button
                        type="button"
                        onClick={() => togglePerson(userId)}
                        className="text-[#999] hover:text-[#333]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 报警提示语 */}
          <div className="flex items-start gap-4">
            <label className="w-20 text-right text-sm text-[#333] pt-1.5 shrink-0">
              报警提示语
            </label>
            <textarea
              placeholder="请输入报警提示语"
              value={alertMessage}
              onChange={(e) => setAlertMessage(e.target.value)}
              rows={3}
              className="flex-1 px-3 py-2 border border-[#d9d9d9] rounded text-sm resize-none focus:border-[#1890ff] focus:outline-none focus:ring-1 focus:ring-[#1890ff]/20"
            />
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="px-6 py-4 border-t border-[#f0f0f0] flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-8 px-4 border border-[#d9d9d9] rounded text-sm text-[#333] hover:border-[#1890ff] hover:text-[#1890ff]"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isValid}
            className="h-8 px-4 bg-[#1890ff] text-white rounded text-sm hover:bg-[#40a9ff] disabled:bg-[#d9d9d9] disabled:cursor-not-allowed"
          >
            保存
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

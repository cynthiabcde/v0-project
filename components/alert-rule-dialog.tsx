"use client";

import { useEffect, useState } from "react";
import { X, Plus, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
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
import {
  AlertRule,
  AlertType,
  SYSTEM_USERS,
  getAlertTypesByCategory,
  getAlertTypeById,
} from "@/lib/alert-data";

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
  const [selectedAlertType, setSelectedAlertType] = useState<AlertType | null>(null);
  const [selectedPersonIds, setSelectedPersonIds] = useState<string[]>([]);
  const [customMessage, setCustomMessage] = useState("");
  const [alertTypeOpen, setAlertTypeOpen] = useState(false);
  const [personOpen, setPersonOpen] = useState(false);

  const alertTypesByCategory = getAlertTypesByCategory();

  useEffect(() => {
    if (rule) {
      setName(rule.name);
      setShopIds(rule.shopIds);
      setSelectedAlertType(getAlertTypeById(rule.alertTypeId) || null);
      setSelectedPersonIds(rule.alertPersonIds);
      setCustomMessage(rule.customMessage);
    } else {
      setName("");
      setShopIds([]);
      setSelectedAlertType(null);
      setSelectedPersonIds([]);
      setCustomMessage("");
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

  const togglePerson = (personId: string) => {
    setSelectedPersonIds((prev) =>
      prev.includes(personId)
        ? prev.filter((id) => id !== personId)
        : [...prev, personId]
    );
  };

  const handleSave = () => {
    if (!name.trim() || shopIds.length === 0 || !selectedAlertType || selectedPersonIds.length === 0) {
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
      alertTypeId: selectedAlertType.id,
      alertTypeCategory: selectedAlertType.category,
      alertPersonIds: selectedPersonIds,
      customMessage: customMessage.trim() || `【店铺{shopId}】${selectedAlertType.name}，请及时处理`,
      enabled: rule?.enabled ?? true,
      createdAt: rule?.createdAt || now,
      updatedAt: now,
    };

    onSave(newRule);
  };

  const isValid = name.trim() && shopIds.length > 0 && selectedAlertType && selectedPersonIds.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{rule ? "编辑报警规则" : "新建报警规则"}</DialogTitle>
          <DialogDescription>
            配置报警触发条件、通知人员和自定义提示语
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Rule Name */}
          <div className="space-y-2">
            <Label htmlFor="rule-name">
              规则名称 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="rule-name"
              placeholder="例如：商品ID异常监控"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Shop IDs */}
          <div className="space-y-2">
            <Label>
              店铺ID <span className="text-destructive">*</span>
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
              <div className="flex flex-wrap gap-2 mt-2">
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
            <p className="text-xs text-muted-foreground">支持添加多个店铺ID，不同店铺可共用同一规则</p>
          </div>

          {/* Alert Type Selection */}
          <div className="space-y-2">
            <Label>
              触发报警状态 <span className="text-destructive">*</span>
            </Label>
            <Popover open={alertTypeOpen} onOpenChange={setAlertTypeOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={alertTypeOpen}
                  className="w-full justify-between font-normal"
                >
                  {selectedAlertType ? (
                    <span className="truncate">{selectedAlertType.name}</span>
                  ) : (
                    <span className="text-muted-foreground">选择报警触发状态...</span>
                  )}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[500px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="搜索报警状态..." />
                  <CommandList className="max-h-[300px]">
                    <CommandEmpty>未找到匹配的报警状态</CommandEmpty>
                    {Object.entries(alertTypesByCategory).map(([category, types]) => (
                      <CommandGroup key={category} heading={category}>
                        {types.map((type) => (
                          <CommandItem
                            key={type.id}
                            value={type.name}
                            onSelect={() => {
                              setSelectedAlertType(type);
                              setAlertTypeOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedAlertType?.id === type.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex-1">
                              <div>{type.name}</div>
                              {type.description && (
                                <div className="text-xs text-muted-foreground">{type.description}</div>
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {selectedAlertType && (
              <Badge variant="outline" className="mt-1">
                {selectedAlertType.category}
              </Badge>
            )}
          </div>

          {/* Alert Person Selection */}
          <div className="space-y-2">
            <Label>
              报警人员 <span className="text-destructive">*</span>
            </Label>
            <Popover open={personOpen} onOpenChange={setPersonOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={personOpen}
                  className="w-full justify-between font-normal"
                >
                  {selectedPersonIds.length > 0 ? (
                    <span className="truncate">
                      已选择 {selectedPersonIds.length} 人
                    </span>
                  ) : (
                    <span className="text-muted-foreground">选择报警通知人员...</span>
                  )}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="搜索人员..." />
                  <CommandList>
                    <CommandEmpty>未找到匹配的人员</CommandEmpty>
                    <CommandGroup>
                      {SYSTEM_USERS.map((user) => (
                        <CommandItem
                          key={user.id}
                          value={user.name}
                          onSelect={() => togglePerson(user.id)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedPersonIds.includes(user.id) ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex-1">
                            <div>{user.name}</div>
                            <div className="text-xs text-muted-foreground">{user.role}</div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {selectedPersonIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedPersonIds.map((id) => {
                  const user = SYSTEM_USERS.find((u) => u.id === id);
                  return (
                    <Badge key={id} variant="secondary" className="gap-1 pr-1">
                      {user?.name || id}
                      <button
                        type="button"
                        onClick={() => togglePerson(id)}
                        className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          {/* Custom Message */}
          <div className="space-y-2">
            <Label htmlFor="custom-message">自定义报警提示语</Label>
            <Textarea
              id="custom-message"
              placeholder="例如：【店铺{shopId}】订单校验失败，关联抖店商品ID未配置，请尽快核查"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              支持使用 {"{shopId}"} 作为店铺ID占位符，报警时会自动替换
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            {rule ? "保存修改" : "创建规则"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

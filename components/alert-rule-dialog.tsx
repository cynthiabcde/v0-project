"use client";

import { useEffect, useState } from "react";
import { X, Plus, ChevronDown, Check, Clock, Zap, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  AlertFrequencyType,
  PollingConfig,
  SYSTEM_USERS,
  getAlertTypesByCategory,
  getAlertTypeById,
  getUsersByRole,
} from "@/lib/alert-data";

interface AlertRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule: AlertRule | null;
  onSave: (rule: AlertRule) => void;
}

const STOP_CONDITIONS = [
  "发放成功",
  "发放失败",
  "已退款",
  "退款中",
  "已取消",
];

export function AlertRuleDialog({ open, onOpenChange, rule, onSave }: AlertRuleDialogProps) {
  const [name, setName] = useState("");
  const [shopIds, setShopIds] = useState<string[]>([]);
  const [shopIdInput, setShopIdInput] = useState("");
  const [selectedAlertTypes, setSelectedAlertTypes] = useState<AlertType[]>([]);
  const [selectedPersonIds, setSelectedPersonIds] = useState<string[]>([]);
  const [customMessage, setCustomMessage] = useState("");
  const [alertTypeOpen, setAlertTypeOpen] = useState(false);
  const [personOpen, setPersonOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  // 告警频率相关
  const [frequencyType, setFrequencyType] = useState<AlertFrequencyType>("instant");
  const [pollingConfig, setPollingConfig] = useState<PollingConfig>({
    startHours: 5,
    intervalHours: 1,
    stopConditions: ["发放成功", "发放失败", "已退款", "退款中"],
  });

  const alertTypesByCategory = getAlertTypesByCategory();
  const usersByRole = getUsersByRole();

  // 预设店铺列表（实际应从后端获取）
  const presetShopIds = [
    { id: "10001", name: "旗舰店A" },
    { id: "10002", name: "专卖店B" },
    { id: "10003", name: "官方店C" },
    { id: "10004", name: "授权店D" },
    { id: "10005", name: "体验店E" },
  ];

  useEffect(() => {
    if (rule) {
      setName(rule.name);
      setShopIds(rule.shopIds);
      // 支持多个alertTypeId（兼容旧数据）
      const alertTypeIds = rule.alertTypeId.split(",");
      const types = alertTypeIds.map(id => getAlertTypeById(id.trim())).filter(Boolean) as AlertType[];
      setSelectedAlertTypes(types);
      setSelectedPersonIds(rule.alertPersonIds);
      setCustomMessage(rule.customMessage);
      setFrequencyType(rule.frequencyType);
      if (rule.pollingConfig) {
        setPollingConfig(rule.pollingConfig);
      }
    } else {
      setName("");
      setShopIds([]);
      setSelectedAlertTypes([]);
      setSelectedPersonIds([]);
      setCustomMessage("");
      setFrequencyType("instant");
      setPollingConfig({
        startHours: 5,
        intervalHours: 1,
        stopConditions: ["发放成功", "发放失败", "已退款", "退款中"],
      });
    }
    setShopIdInput("");
  }, [rule, open]);

  // 检查是否有支持轮询的告警类型被选中
  const hasPollingSupport = selectedAlertTypes.some(t => t.supportsPolling);

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

  const toggleShop = (shopId: string) => {
    setShopIds((prev) =>
      prev.includes(shopId)
        ? prev.filter((id) => id !== shopId)
        : [...prev, shopId]
    );
  };

  const toggleAlertType = (alertType: AlertType) => {
    setSelectedAlertTypes((prev) => {
      const exists = prev.find(t => t.id === alertType.id);
      if (exists) {
        return prev.filter((t) => t.id !== alertType.id);
      } else {
        return [...prev, alertType];
      }
    });
  };

  const togglePerson = (personId: string) => {
    setSelectedPersonIds((prev) =>
      prev.includes(personId)
        ? prev.filter((id) => id !== personId)
        : [...prev, personId]
    );
  };

  const toggleStopCondition = (condition: string) => {
    setPollingConfig((prev) => ({
      ...prev,
      stopConditions: prev.stopConditions.includes(condition)
        ? prev.stopConditions.filter((c) => c !== condition)
        : [...prev.stopConditions, condition],
    }));
  };

  const handleSave = () => {
    if (!name.trim() || shopIds.length === 0 || selectedAlertTypes.length === 0 || selectedPersonIds.length === 0) {
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

    // 组合多个告警类型ID
    const alertTypeIds = selectedAlertTypes.map(t => t.id).join(",");
    const alertTypeCategories = [...new Set(selectedAlertTypes.map(t => t.category))].join(",");

    const newRule: AlertRule = {
      id: rule?.id || "",
      name: name.trim(),
      shopIds,
      alertTypeId: alertTypeIds,
      alertTypeCategory: alertTypeCategories,
      alertPersonIds: selectedPersonIds,
      customMessage: customMessage.trim() || `【店铺{shopId}】${selectedAlertTypes.map(t => t.name).join("、")}，请及时处理`,
      enabled: rule?.enabled ?? true,
      frequencyType,
      pollingConfig: frequencyType === "polling" ? pollingConfig : undefined,
      createdAt: rule?.createdAt || now,
      updatedAt: now,
    };

    onSave(newRule);
  };

  const isValid = name.trim() && shopIds.length > 0 && selectedAlertTypes.length > 0 && selectedPersonIds.length > 0;

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

          {/* Shop IDs - Multi Select */}
          <div className="space-y-2">
            <Label>
              店铺ID <span className="text-destructive">*</span>
              <span className="text-muted-foreground text-xs ml-2">（支持多选）</span>
            </Label>
            <div className="flex gap-2">
              <Popover open={shopOpen} onOpenChange={setShopOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={shopOpen}
                    className="flex-1 justify-between font-normal"
                  >
                    {shopIds.length > 0 ? (
                      <span className="truncate">已选择 {shopIds.length} 个店铺</span>
                    ) : (
                      <span className="text-muted-foreground">选择店铺...</span>
                    )}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="搜索店铺..." />
                    <CommandList>
                      <CommandEmpty>未找到匹配的店铺</CommandEmpty>
                      <CommandGroup heading="预设店铺">
                        {presetShopIds.map((shop) => (
                          <CommandItem
                            key={shop.id}
                            value={`${shop.id} ${shop.name}`}
                            onSelect={() => toggleShop(shop.id)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                shopIds.includes(shop.id) ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex-1">
                              <div className="font-medium">{shop.id}</div>
                              <div className="text-xs text-muted-foreground">{shop.name}</div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* 手动输入店铺ID */}
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="手动输入店铺ID后按回车添加"
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
                {shopIds.map((id) => {
                  const preset = presetShopIds.find(s => s.id === id);
                  return (
                    <Badge key={id} variant="secondary" className="gap-1 pr-1">
                      {preset ? `${id} (${preset.name})` : id}
                      <button
                        type="button"
                        onClick={() => handleRemoveShopId(id)}
                        className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}
            <p className="text-xs text-muted-foreground">可从预设列表选择，也可手动输入新的店铺ID</p>
          </div>

          {/* Alert Type Selection - Multi Select */}
          <div className="space-y-2">
            <Label>
              触发报警状态 <span className="text-destructive">*</span>
              <span className="text-muted-foreground text-xs ml-2">（支持多选）</span>
            </Label>
            <Popover open={alertTypeOpen} onOpenChange={setAlertTypeOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={alertTypeOpen}
                  className="w-full justify-between font-normal"
                >
                  {selectedAlertTypes.length > 0 ? (
                    <span className="truncate">已选择 {selectedAlertTypes.length} 个状态</span>
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
                            onSelect={() => toggleAlertType(type)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedAlertTypes.find(t => t.id === type.id) ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                {type.name}
                                {type.supportsPolling && (
                                  <Badge variant="outline" className="text-xs px-1 py-0">
                                    <Clock className="h-3 w-3 mr-1" />
                                    支持轮询
                                  </Badge>
                                )}
                              </div>
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
            {selectedAlertTypes.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedAlertTypes.map((type) => (
                  <Badge key={type.id} variant="secondary" className="gap-1 pr-1">
                    {type.name}
                    <button
                      type="button"
                      onClick={() => toggleAlertType(type)}
                      className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Alert Frequency Type */}
          <div className="space-y-3">
            <Label>
              告警频率类型 <span className="text-destructive">*</span>
            </Label>
            <RadioGroup
              value={frequencyType}
              onValueChange={(value) => setFrequencyType(value as AlertFrequencyType)}
              className="grid grid-cols-2 gap-4"
            >
              <div className="relative">
                <RadioGroupItem value="instant" id="instant" className="peer sr-only" />
                <Label
                  htmlFor="instant"
                  className={cn(
                    "flex items-start gap-3 rounded-lg border-2 p-4 cursor-pointer transition-colors",
                    "hover:bg-accent/50",
                    frequencyType === "instant" 
                      ? "border-primary bg-accent/30" 
                      : "border-border"
                  )}
                >
                  <Zap className="h-5 w-5 mt-0.5 text-warning" />
                  <div className="space-y-1">
                    <div className="font-medium">即时告警</div>
                    <div className="text-xs text-muted-foreground">
                      触发条件满足后立即发送一次告警
                    </div>
                  </div>
                </Label>
              </div>
              <div className="relative">
                <RadioGroupItem value="polling" id="polling" className="peer sr-only" />
                <Label
                  htmlFor="polling"
                  className={cn(
                    "flex items-start gap-3 rounded-lg border-2 p-4 cursor-pointer transition-colors",
                    "hover:bg-accent/50",
                    frequencyType === "polling" 
                      ? "border-primary bg-accent/30" 
                      : "border-border",
                    !hasPollingSupport && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Clock className="h-5 w-5 mt-0.5 text-chart-1" />
                  <div className="space-y-1">
                    <div className="font-medium">轮询重复告警</div>
                    <div className="text-xs text-muted-foreground">
                      按设定间隔持续告警，直到满足停止条件
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
            {!hasPollingSupport && frequencyType === "polling" && (
              <div className="flex items-center gap-2 text-xs text-warning bg-warning/10 p-2 rounded">
                <AlertCircle className="h-4 w-4" />
                当前选中的告警状态不支持轮询，请选择支持轮询的状态或切换为即时告警
              </div>
            )}
          </div>

          {/* Polling Configuration */}
          {frequencyType === "polling" && (
            <div className="space-y-4 p-4 rounded-lg bg-accent/20 border border-border">
              <div className="text-sm font-medium">轮询配置</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-hours">开始告警阈值（小时）</Label>
                  <Input
                    id="start-hours"
                    type="number"
                    min={1}
                    max={24}
                    value={pollingConfig.startHours}
                    onChange={(e) =>
                      setPollingConfig((prev) => ({
                        ...prev,
                        startHours: parseInt(e.target.value) || 1,
                      }))
                    }
                  />
                  <p className="text-xs text-muted-foreground">超过此时长后开始告警</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interval-hours">告警间隔（小时）</Label>
                  <Input
                    id="interval-hours"
                    type="number"
                    min={1}
                    max={12}
                    value={pollingConfig.intervalHours}
                    onChange={(e) =>
                      setPollingConfig((prev) => ({
                        ...prev,
                        intervalHours: parseInt(e.target.value) || 1,
                      }))
                    }
                  />
                  <p className="text-xs text-muted-foreground">每隔此时长重复告警</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>停止条件（订单状态变更为以下状态时停止告警）</Label>
                <div className="flex flex-wrap gap-2">
                  {STOP_CONDITIONS.map((condition) => (
                    <Badge
                      key={condition}
                      variant={pollingConfig.stopConditions.includes(condition) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleStopCondition(condition)}
                    >
                      {pollingConfig.stopConditions.includes(condition) && (
                        <Check className="h-3 w-3 mr-1" />
                      )}
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

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
              <PopoverContent className="w-[350px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="搜索人员..." />
                  <CommandList className="max-h-[300px]">
                    <CommandEmpty>未找到匹配的人员</CommandEmpty>
                    {Object.entries(usersByRole).map(([role, users]) => (
                      <CommandGroup key={role} heading={role}>
                        {users.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={`${user.name} ${user.role} ${user.department}`}
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
                              <div className="text-xs text-muted-foreground">{user.department}</div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ))}
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
                      <span className="text-muted-foreground text-xs">({user?.role})</span>
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
              支持占位符：{"{shopId}"} 店铺ID、{"{duration}"} 持续时长（轮询模式）
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

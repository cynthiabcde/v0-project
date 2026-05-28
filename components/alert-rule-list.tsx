"use client";

import { MoreHorizontal, Pencil, Trash2, Store, Users, MessageSquare, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { AlertRule, getAlertTypeById, getUserNamesByIds } from "@/lib/alert-data";

interface AlertRuleListProps {
  rules: AlertRule[];
  onEdit: (rule: AlertRule) => void;
  onDelete: (ruleId: string) => void;
  onToggle: (ruleId: string) => void;
}

export function AlertRuleList({ rules, onEdit, onDelete, onToggle }: AlertRuleListProps) {
  const [deleteRuleId, setDeleteRuleId] = useState<string | null>(null);

  const handleDeleteConfirm = () => {
    if (deleteRuleId) {
      onDelete(deleteRuleId);
      setDeleteRuleId(null);
    }
  };

  // 解析多个告警类型ID
  const getAlertTypeNames = (alertTypeId: string) => {
    const ids = alertTypeId.split(",");
    return ids.map(id => {
      const type = getAlertTypeById(id.trim());
      return type?.name || id.trim();
    });
  };

  // 解析多个类别
  const getCategories = (category: string) => {
    return [...new Set(category.split(",").map(c => c.trim()))];
  };

  if (rules.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <MessageSquare className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mb-1 text-lg font-medium text-foreground">暂无报警规则</h3>
        <p className="text-sm text-muted-foreground">点击上方"新建规则"按钮创建第一条报警规则</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {rules.map((rule) => {
          const alertTypeNames = getAlertTypeNames(rule.alertTypeId);
          const categories = getCategories(rule.alertTypeCategory);
          const personNames = getUserNamesByIds(rule.alertPersonIds);

          return (
            <div
              key={rule.id}
              className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-muted-foreground/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  {/* Header */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${rule.enabled ? "bg-success" : "bg-muted-foreground"}`} />
                      <h3 className="font-medium text-foreground">{rule.name}</h3>
                    </div>
                    {categories.map((cat, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs font-normal">
                        {cat}
                      </Badge>
                    ))}
                    {/* 告警频率标签 */}
                    <Badge 
                      variant={rule.frequencyType === "polling" ? "default" : "secondary"} 
                      className="text-xs gap-1"
                    >
                      {rule.frequencyType === "polling" ? (
                        <>
                          <Clock className="h-3 w-3" />
                          轮询告警
                        </>
                      ) : (
                        <>
                          <Zap className="h-3 w-3" />
                          即时告警
                        </>
                      )}
                    </Badge>
                  </div>

                  {/* Alert Types - 支持多个 */}
                  <div className="text-sm">
                    <span className="text-muted-foreground">触发状态：</span>
                    <div className="inline-flex flex-wrap gap-1.5 ml-1">
                      {alertTypeNames.map((name, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs font-normal">
                          {name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Polling Config */}
                  {rule.frequencyType === "polling" && rule.pollingConfig && (
                    <div className="text-sm text-muted-foreground bg-accent/20 rounded-md px-3 py-2">
                      <span className="text-foreground/80">轮询配置：</span>
                      超过 {rule.pollingConfig.startHours} 小时开始告警，每 {rule.pollingConfig.intervalHours} 小时重复
                      {rule.pollingConfig.stopConditions.length > 0 && (
                        <span>，状态变为【{rule.pollingConfig.stopConditions.join("、")}】时停止</span>
                      )}
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Store className="h-4 w-4" />
                      <span>店铺：</span>
                      <div className="flex flex-wrap gap-1">
                        {rule.shopIds.map((id, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs font-normal">
                            {id}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      <span>报警人员：</span>
                      <span className="text-foreground/80">{personNames.join(", ")}</span>
                    </div>
                  </div>

                  {/* Custom Message */}
                  <div className="rounded-md bg-muted/50 p-3 text-sm">
                    <span className="text-muted-foreground">报警提示语：</span>
                    <span className="text-foreground/90">{rule.customMessage}</span>
                  </div>

                  {/* Timestamps */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>创建时间：{rule.createdAt}</span>
                    <span>更新时间：{rule.updatedAt}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={() => onToggle(rule.id)}
                    aria-label={rule.enabled ? "禁用规则" : "启用规则"}
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">操作菜单</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(rule)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        编辑规则
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeleteRuleId(rule.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        删除规则
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteRuleId} onOpenChange={() => setDeleteRuleId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除此报警规则吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

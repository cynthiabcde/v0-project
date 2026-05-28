"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import {
  type AlertRule,
  getStatusLabel,
  getUserName,
} from "@/lib/alert-data"

interface AlertRuleListProps {
  rules: AlertRule[]
  onEdit: (rule: AlertRule) => void
  onDelete: (ruleId: string) => void
  onToggle: (ruleId: string) => void
}

export function AlertRuleList({
  rules,
  onEdit,
  onDelete,
  onToggle,
}: AlertRuleListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleConfirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId)
      setDeleteId(null)
    }
  }

  return (
    <>
      <div className="rounded border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-20 text-foreground font-medium text-sm">规则ID</TableHead>
              <TableHead className="text-foreground font-medium text-sm">规则名称</TableHead>
              <TableHead className="text-foreground font-medium text-sm">触发状态</TableHead>
              <TableHead className="text-foreground font-medium text-sm">店铺ID</TableHead>
              <TableHead className="text-foreground font-medium text-sm">报警人员</TableHead>
              <TableHead className="text-foreground font-medium text-sm">提示语</TableHead>
              <TableHead className="w-24 text-foreground font-medium text-sm">状态</TableHead>
              <TableHead className="text-foreground font-medium text-sm">新建人</TableHead>
              <TableHead className="text-foreground font-medium text-sm">新建时间</TableHead>
              <TableHead className="text-foreground font-medium text-sm">修改人</TableHead>
              <TableHead className="w-32 text-foreground font-medium text-sm">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="h-24 text-center text-muted-foreground">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              rules.map((rule) => (
                <TableRow key={rule.id} className="hover:bg-muted/30">
                  <TableCell className="text-sm">{rule.id}</TableCell>
                  <TableCell className="text-sm font-medium">{rule.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {rule.triggerStatuses.slice(0, 2).map((status) => (
                        <Badge
                          key={status}
                          variant="secondary"
                          className="text-xs font-normal"
                        >
                          {getStatusLabel(status)}
                        </Badge>
                      ))}
                      {rule.triggerStatuses.length > 2 && (
                        <Badge variant="outline" className="text-xs font-normal">
                          +{rule.triggerStatuses.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-32">
                    <span className="line-clamp-2">{rule.shopIds.join("; ")}</span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {rule.alertUserIds.map((id) => getUserName(id)).join(", ")}
                  </TableCell>
                  <TableCell className="max-w-40">
                    <p className="truncate text-sm text-muted-foreground" title={rule.alertMessage}>
                      {rule.alertMessage}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={rule.enabled ? "default" : "outline"}
                      className={
                        rule.enabled
                          ? "bg-green-50 text-green-600 hover:bg-green-50 border-green-200"
                          : "text-muted-foreground"
                      }
                    >
                      {rule.enabled ? "正常发放" : "已作废"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{rule.createdBy}</TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {rule.createdAt}
                  </TableCell>
                  <TableCell className="text-sm">{rule.updatedBy}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={() => onToggle(rule.id)}
                        className="scale-75"
                      />
                      <button
                        onClick={() => onEdit(rule)}
                        className="text-sm text-primary hover:underline"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => onEdit(rule)}
                        className="text-sm text-primary hover:underline"
                      >
                        详情
                      </button>
                      <button
                        onClick={() => setDeleteId(rule.id)}
                        className="text-sm text-primary hover:underline"
                      >
                        作废
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>20条/页</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="px-2 py-1 text-muted-foreground hover:text-foreground">
            &lt;
          </button>
          <button className="px-3 py-1 rounded bg-primary text-primary-foreground">
            1
          </button>
          <button className="px-3 py-1 rounded hover:bg-muted">2</button>
          <button className="px-2 py-1 text-muted-foreground hover:text-foreground">
            &gt;
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认作废</AlertDialogTitle>
            <AlertDialogDescription>
              确定要作废此报警规则吗？作废后该规则将不再触发报警。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              确认作废
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

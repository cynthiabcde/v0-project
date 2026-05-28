"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
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
      <div className="bg-white border border-[#e8e8e8] rounded overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#fafafa]">
              <th className="border border-[#e8e8e8] px-3 py-2 text-left font-medium text-[#333]">规则ID</th>
              <th className="border border-[#e8e8e8] px-3 py-2 text-left font-medium text-[#333]">规则名称</th>
              <th className="border border-[#e8e8e8] px-3 py-2 text-left font-medium text-[#333]">触发状态</th>
              <th className="border border-[#e8e8e8] px-3 py-2 text-left font-medium text-[#333]">状态</th>
              <th className="border border-[#e8e8e8] px-3 py-2 text-left font-medium text-[#333]">店铺ID</th>
              <th className="border border-[#e8e8e8] px-3 py-2 text-left font-medium text-[#333]">报警人员</th>
              <th className="border border-[#e8e8e8] px-3 py-2 text-left font-medium text-[#333]">提示语</th>
              <th className="border border-[#e8e8e8] px-3 py-2 text-left font-medium text-[#333]">新建人</th>
              <th className="border border-[#e8e8e8] px-3 py-2 text-left font-medium text-[#333]">新建时间</th>
              <th className="border border-[#e8e8e8] px-3 py-2 text-left font-medium text-[#333]">修改人</th>
              <th className="border border-[#e8e8e8] px-3 py-2 text-left font-medium text-[#333]">操作</th>
            </tr>
          </thead>
          <tbody>
            {rules.length === 0 ? (
              <tr>
                <td colSpan={11} className="border border-[#e8e8e8] px-3 py-8 text-center text-[#999]">
                  暂无数据
                </td>
              </tr>
            ) : (
              rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-[#fafafa]">
                  <td className="border border-[#e8e8e8] px-3 py-2 text-[#333]">{rule.id}</td>
                  <td className="border border-[#e8e8e8] px-3 py-2 text-[#333]">{rule.name}</td>
                  <td className="border border-[#e8e8e8] px-3 py-2 text-[#333]">
                    {rule.triggerStatuses.map((status) => getStatusLabel(status)).join("；")}
                  </td>
                  <td className="border border-[#e8e8e8] px-3 py-2">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs ${
                        rule.enabled
                          ? "bg-[#e6fffb] text-[#13c2c2] border border-[#87e8de]"
                          : "bg-[#fff1f0] text-[#999] border border-[#ffa39e]"
                      }`}
                    >
                      {rule.enabled ? "正常发放" : "已作废"}
                    </span>
                  </td>
                  <td className="border border-[#e8e8e8] px-3 py-2 text-[#333] max-w-[120px]">
                    <span className="block truncate" title={rule.shopIds.join("；")}>
                      {rule.shopIds.join("；")}
                    </span>
                  </td>
                  <td className="border border-[#e8e8e8] px-3 py-2 text-[#333]">
                    {rule.alertUserIds.map((id) => getUserName(id)).join("；")}
                  </td>
                  <td className="border border-[#e8e8e8] px-3 py-2 text-[#333] max-w-[150px]">
                    <span className="block truncate" title={rule.alertMessage}>
                      {rule.alertMessage}
                    </span>
                  </td>
                  <td className="border border-[#e8e8e8] px-3 py-2 text-[#333]">{rule.createdBy}</td>
                  <td className="border border-[#e8e8e8] px-3 py-2 text-[#333] whitespace-nowrap">
                    {rule.createdAt}
                  </td>
                  <td className="border border-[#e8e8e8] px-3 py-2 text-[#333]">{rule.updatedBy}</td>
                  <td className="border border-[#e8e8e8] px-3 py-2">
                    <div className="flex items-center gap-1">
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={() => onToggle(rule.id)}
                        className="scale-75"
                      />
                      <button
                        onClick={() => onEdit(rule)}
                        className="text-[#1890ff] hover:text-[#40a9ff] px-1"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => onEdit(rule)}
                        className="text-[#1890ff] hover:text-[#40a9ff] px-1"
                      >
                        详情
                      </button>
                      <button
                        onClick={() => setDeleteId(rule.id)}
                        className="text-[#1890ff] hover:text-[#40a9ff] px-1"
                      >
                        作废
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-[#666]">
          <select className="h-7 px-2 border border-[#d9d9d9] rounded bg-white text-sm">
            <option>20条/页</option>
            <option>50条/页</option>
            <option>100条/页</option>
          </select>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 flex items-center justify-center border border-[#d9d9d9] rounded text-[#666] hover:border-[#1890ff] hover:text-[#1890ff]">
            &lt;
          </button>
          <button className="w-7 h-7 flex items-center justify-center border border-[#1890ff] rounded bg-[#1890ff] text-white">
            1
          </button>
          <button className="w-7 h-7 flex items-center justify-center border border-[#d9d9d9] rounded text-[#666] hover:border-[#1890ff] hover:text-[#1890ff]">
            2
          </button>
          <button className="w-7 h-7 flex items-center justify-center border border-[#d9d9d9] rounded text-[#666] hover:border-[#1890ff] hover:text-[#1890ff]">
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

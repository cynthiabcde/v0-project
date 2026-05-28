"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
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
import { AlertRule, ALERT_TYPES, SYSTEM_USERS } from "@/lib/alert-data";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AlertRuleListProps {
  rules: AlertRule[];
  onEdit: (rule: AlertRule) => void;
  onDelete: (ruleId: string) => void;
  onToggle: (ruleId: string) => void;
}

// 根据状态ID获取名称
function getStatusLabel(statusId: string): string {
  const status = ALERT_TYPES.find((s) => s.id === statusId);
  return status?.name || statusId;
}

// 根据用户ID获取名称
function getUserNames(userIds: string[]): string {
  return userIds
    .map((id) => {
      const user = SYSTEM_USERS.find((u) => u.id === id);
      return user?.name || id;
    })
    .join("；");
}

export function AlertRuleList({ rules, onEdit, onDelete, onToggle }: AlertRuleListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const handleDeleteConfirm = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const totalPages = Math.ceil(rules.length / pageSize);
  const paginatedRules = rules.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      <div className="bg-white rounded">
        {/* 表格 */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f0f0f0]">
                <th className="px-4 py-3 text-left font-medium text-[#333] bg-[#fafafa]">规则ID</th>
                <th className="px-4 py-3 text-left font-medium text-[#333] bg-[#fafafa]">规则名称</th>
                <th className="px-4 py-3 text-left font-medium text-[#333] bg-[#fafafa]">开关</th>
                <th className="px-4 py-3 text-left font-medium text-[#333] bg-[#fafafa]">触发状态</th>
                <th className="px-4 py-3 text-left font-medium text-[#333] bg-[#fafafa]">规则状态</th>
                <th className="px-4 py-3 text-left font-medium text-[#333] bg-[#fafafa]">店铺ID</th>
                <th className="px-4 py-3 text-left font-medium text-[#333] bg-[#fafafa]">报警人员</th>
                <th className="px-4 py-3 text-left font-medium text-[#333] bg-[#fafafa]">提示语</th>
                <th className="px-4 py-3 text-left font-medium text-[#333] bg-[#fafafa]">新建人</th>
                <th className="px-4 py-3 text-left font-medium text-[#333] bg-[#fafafa]">新建时间</th>
                <th className="px-4 py-3 text-left font-medium text-[#333] bg-[#fafafa]">修改人</th>
                <th className="px-4 py-3 text-left font-medium text-[#333] bg-[#fafafa]">操作</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRules.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-4 py-8 text-center text-[#999]">
                    暂无数据
                  </td>
                </tr>
              ) : (
                paginatedRules.map((rule) => (
                  <tr key={rule.id} className="border-b border-[#f0f0f0] hover:bg-[#fafafa]">
                    <td className="px-4 py-3 text-[#333]">{rule.id}</td>
                    <td className="px-4 py-3 text-[#333]">{rule.name}</td>
                    <td className="px-4 py-3">
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={() => onToggle(rule.id)}
                        disabled={rule.deprecated}
                        className="scale-90"
                      />
                    </td>
                    <td className="px-4 py-3 text-[#333] max-w-[200px]">
                      <span className="line-clamp-2">
                        {rule.triggerStatuses.map((status) => getStatusLabel(status)).join("；")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs border ${
                          rule.deprecated
                            ? "bg-[#f5f5f5] text-[#999] border-[#d9d9d9]"
                            : rule.enabled
                              ? "bg-[#e6fffb] text-[#13c2c2] border-[#87e8de]"
                              : "bg-[#fff7e6] text-[#fa8c16] border-[#ffd591]"
                        }`}
                      >
                        {rule.deprecated ? "已作废" : rule.enabled ? "使用中" : "已暂停"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#333] max-w-[120px]">
                      <span className="line-clamp-2">{rule.shopIds.join("；")}</span>
                    </td>
                    <td className="px-4 py-3 text-[#333] max-w-[100px]">
                      <span className="line-clamp-2">{getUserNames(rule.alertUserIds)}</span>
                    </td>
                    <td className="px-4 py-3 text-[#333] max-w-[180px]">
                      <span className="line-clamp-2">{rule.alertMessage}</span>
                    </td>
                    <td className="px-4 py-3 text-[#333]">{rule.createdBy}</td>
                    <td className="px-4 py-3 text-[#333] whitespace-nowrap">{rule.createdAt}</td>
                    <td className="px-4 py-3 text-[#333]">{rule.updatedBy}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {rule.deprecated ? (
                          <button
                            onClick={() => onEdit(rule)}
                            className="text-[#1890ff] hover:text-[#40a9ff] text-sm"
                          >
                            详情
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => onEdit(rule)}
                              className="text-[#1890ff] hover:text-[#40a9ff] text-sm"
                            >
                              编辑
                            </button>
                            <button
                              onClick={() => onEdit(rule)}
                              className="text-[#1890ff] hover:text-[#40a9ff] text-sm"
                            >
                              详情
                            </button>
                            <button
                              onClick={() => setDeleteId(rule.id)}
                              className="text-[#1890ff] hover:text-[#40a9ff] text-sm"
                            >
                              作废
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#f0f0f0]">
          <div className="flex items-center gap-2 text-sm text-[#333]">
            <span>{pageSize}条/页</span>
            <ChevronRight className="w-4 h-4 text-[#999]" />
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center border border-[#d9d9d9] rounded text-[#333] disabled:text-[#d9d9d9] hover:border-[#1890ff] hover:text-[#1890ff] disabled:hover:border-[#d9d9d9] disabled:hover:text-[#d9d9d9]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center border rounded text-sm ${
                  currentPage === page
                    ? "bg-[#1890ff] border-[#1890ff] text-white"
                    : "border-[#d9d9d9] text-[#333] hover:border-[#1890ff] hover:text-[#1890ff]"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="w-8 h-8 flex items-center justify-center border border-[#d9d9d9] rounded text-[#333] disabled:text-[#d9d9d9] hover:border-[#1890ff] hover:text-[#1890ff] disabled:hover:border-[#d9d9d9] disabled:hover:text-[#d9d9d9]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 作废确认弹窗 */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认作废</AlertDialogTitle>
            <AlertDialogDescription>
              确定要作废此报警规则吗？作废后将无法恢复，只能查看详情。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-[#ff4d4f] hover:bg-[#ff7875]"
            >
              确认作废
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

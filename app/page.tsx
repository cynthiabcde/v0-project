"use client"

import { useState } from "react"
import { Search, Plus, Gift, Settings, Bell, ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertRuleList } from "@/components/alert-rule-list"
import { AlertRuleDialog } from "@/components/alert-rule-dialog"
import { type AlertRule, SAMPLE_RULES } from "@/lib/alert-data"

type MenuItem = "gift" | "alert"

export default function AlertRulesPage() {
  const [rules, setRules] = useState<AlertRule[]>(SAMPLE_RULES)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null)
  const [activeMenu, setActiveMenu] = useState<MenuItem>("alert")
  const [activeTab, setActiveTab] = useState<string>("alert")

  const filteredRules = rules.filter(
    (rule) =>
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.shopIds.some((id) => id.includes(searchQuery))
  )

  const handleCreateRule = () => {
    setEditingRule(null)
    setIsDialogOpen(true)
  }

  const handleEditRule = (rule: AlertRule) => {
    setEditingRule(rule)
    setIsDialogOpen(true)
  }

  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.map((r) => (r.id === ruleId ? { ...r, deprecated: true, enabled: false } : r)))
  }

  const handleToggleRule = (ruleId: string) => {
    setRules(
      rules.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    )
  }

  const handleSaveRule = (rule: AlertRule) => {
    if (editingRule) {
      setRules(rules.map((r) => (r.id === rule.id ? rule : r)))
    } else {
      setRules([...rules, { ...rule, id: `${Date.now()}`, deprecated: false }])
    }
    setIsDialogOpen(false)
    setEditingRule(null)
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col">
      {/* Top Header */}
      <header className="h-12 bg-white border-b border-[#e8e8e8] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center">
          <div className="flex items-center gap-2 text-[#1890ff] font-medium">
            <div className="w-8 h-8 rounded-full bg-[#1890ff] flex items-center justify-center">
              <Gift className="h-4 w-4 text-white" />
            </div>
            <span className="text-base">礼包中心</span>
          </div>
          <nav className="ml-8 flex items-center gap-6 text-sm">
            <span className="text-[#333] cursor-pointer hover:text-[#1890ff]">礼包管理</span>
            <span className="text-[#999] cursor-pointer hover:text-[#1890ff]">系统设置</span>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#1890ff] cursor-pointer">英语</span>
          <span className="text-sm text-[#333]">中文（简体）</span>
          <span className="text-[#999]">:</span>
          <span className="text-sm text-[#333]">×</span>
          <div className="flex items-center gap-2 text-sm text-[#333]">
            <span>系统管理员11</span>
            <div className="w-8 h-8 rounded-full bg-[#87d068] flex items-center justify-center text-white text-xs">
              管
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-[140px] bg-white border-r border-[#e8e8e8] shrink-0">
          <nav className="py-2">
            <button
              onClick={() => setActiveMenu("gift")}
              className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 ${
                activeMenu === "gift"
                  ? "text-[#1890ff] bg-[#e6f7ff]"
                  : "text-[#333] hover:bg-[#f5f5f5]"
              }`}
            >
              <Settings className="h-4 w-4" />
              礼包管理
            </button>
            <button
              onClick={() => setActiveMenu("alert")}
              className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 ${
                activeMenu === "alert"
                  ? "text-[#1890ff] bg-[#e6f7ff]"
                  : "text-[#333] hover:bg-[#f5f5f5]"
              }`}
            >
              <Bell className="h-4 w-4" />
              报警管理
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Tab Bar */}
          <div className="h-10 bg-white border-b border-[#e8e8e8] flex items-center px-2 shrink-0">
            <div className="inline-flex items-center gap-1 rounded bg-[#1890ff] px-3 py-1 text-sm text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              {activeMenu === "alert" ? "报警管理" : "礼包管理"}
              <button className="ml-1 text-white/70 hover:text-white">
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-4 overflow-auto">
            {activeMenu === "alert" ? (
              <>
                {/* Search Bar */}
                <div className="bg-white border border-[#e8e8e8] rounded p-4 mb-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#333] whitespace-nowrap">规则名称</span>
                      <Input
                        placeholder="请输入规则名称"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-48 h-8 text-sm border-[#d9d9d9] rounded"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#333] whitespace-nowrap">店铺ID</span>
                      <Input
                        placeholder="请输入店铺ID"
                        className="w-36 h-8 text-sm border-[#d9d9d9] rounded"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#333] whitespace-nowrap">状态</span>
                      <button className="h-8 px-3 border border-[#d9d9d9] rounded bg-white text-sm text-[#999] flex items-center gap-2 w-32">
                        请选择状态
                        <ChevronDown className="h-4 w-4 ml-auto" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                      <Button
                        size="sm"
                        className="h-8 bg-[#1890ff] hover:bg-[#40a9ff] text-white rounded"
                      >
                        查询
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 bg-[#1890ff] hover:bg-[#40a9ff] text-white rounded"
                        onClick={handleCreateRule}
                      >
                        新建规则
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Rules Table */}
                <AlertRuleList
                  rules={filteredRules}
                  onEdit={handleEditRule}
                  onDelete={handleDeleteRule}
                  onToggle={handleToggleRule}
                />

                {/* Create/Edit Dialog */}
                <AlertRuleDialog
                  open={isDialogOpen}
                  onOpenChange={setIsDialogOpen}
                  rule={editingRule}
                  onSave={handleSaveRule}
                />
              </>
            ) : (
              <div className="bg-white border border-[#e8e8e8] rounded p-8 text-center text-[#999]">
                礼包管理页面内容
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

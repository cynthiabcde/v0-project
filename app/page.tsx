"use client"

import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertRuleList } from "@/components/alert-rule-list"
import { AlertRuleDialog } from "@/components/alert-rule-dialog"
import { type AlertRule, SAMPLE_RULES } from "@/lib/alert-data"

export default function AlertRulesPage() {
  const [rules, setRules] = useState<AlertRule[]>(SAMPLE_RULES)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null)

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
    setRules(rules.filter((r) => r.id !== ruleId))
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
      setRules([...rules, { ...rule, id: `${Date.now()}` }])
    }
    setIsDialogOpen(false)
    setEditingRule(null)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-12 items-center px-4">
          <div className="flex items-center gap-2 text-primary font-medium">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span>报警中心</span>
          </div>
          <nav className="ml-8 flex items-center gap-6 text-sm">
            <span className="text-foreground">报警管理</span>
            <span className="text-muted-foreground">系统设置</span>
          </nav>
        </div>
      </header>

      {/* Sub Header */}
      <div className="border-b border-border bg-card px-4 py-2">
        <div className="inline-flex items-center gap-1 rounded bg-primary px-3 py-1 text-sm text-primary-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
          报警管理
          <button className="ml-1 text-primary-foreground/70 hover:text-primary-foreground">
            &times;
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-4">
        {/* Search Bar */}
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground whitespace-nowrap">规则</span>
            <Input
              placeholder="请输入规则名称或店铺ID查询"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 h-8 text-sm"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Button
              size="sm"
              className="h-8"
              onClick={() => setSearchQuery(searchQuery)}
            >
              <Search className="mr-1 h-4 w-4" />
              查询
            </Button>
            <Button size="sm" className="h-8" onClick={handleCreateRule}>
              <Plus className="mr-1 h-4 w-4" />
              新建规则
            </Button>
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
      </main>
    </div>
  )
}

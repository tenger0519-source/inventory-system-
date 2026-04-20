"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/app-context"

export default function NotificationBell() {
  const { currentUser, productRequests, respondToProductRequest, users } = useApp()
  const [open, setOpen] = useState(false)

  if (!currentUser) return null

  const incoming = productRequests.filter(
    r => r.toUserId === currentUser.id && r.status === "pending"
  )

  const typeLabel = (type: "give" | "take", fromMe: boolean) => {
    if (fromMe) return type === "give" ? "Өгөх" : "Авах"
    // from their perspective: if sender wants to "give", receiver is being asked to receive
    return type === "give" ? "Хүлээн авах" : "Өгөх"
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen(o => !o)}
        className="relative"
      >
        <Bell className="h-4 w-4" />
        {incoming.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-medium">
            {incoming.length}
          </span>
        )}
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-10 z-50 w-80 rounded-lg border bg-background shadow-lg">
            <div className="border-b px-4 py-3">
              <p className="font-medium text-sm">Бүтээгдэхүүний хүсэлтүүд</p>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {incoming.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">Хүсэлт байхгүй байна.</p>
              ) : (
                incoming.map(r => {
                  const sender = users.find(u => u.id === r.fromUserId)
                  return (
                    <div key={r.id} className="border-b p-4 space-y-2 last:border-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium">{sender?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {typeLabel(r.type, false)}: {r.product} — {r.quantity}ш
                          </p>
                        </div>
                        <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                          r.type === "give"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-amber-50 text-amber-700"
                        }`}>
                          {r.type === "give" ? "Өгөх" : "Авах"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => respondToProductRequest(r.id, true)}
                        >
                          Зөвшөөрөх
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => respondToProductRequest(r.id, false)}
                        >
                          Татгалзах
                        </Button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
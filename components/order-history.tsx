import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Eye, Download } from "lucide-react"

export function OrderHistory() {
  const orders = [
    {
      id: "ORD-12345",
      date: "May 15, 2023",
      status: "Delivered",
      total: 129.99,
      items: 3,
    },
    {
      id: "ORD-12346",
      date: "April 28, 2023",
      status: "Delivered",
      total: 79.95,
      items: 2,
    },
    {
      id: "ORD-12347",
      date: "March 12, 2023",
      status: "Delivered",
      total: 249.99,
      items: 1,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>View and manage your previous orders</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg"
                >
                  <div className="flex items-start gap-4 mb-4 sm:mb-0">
                    <div className="rounded-md bg-orange-100 p-2 dark:bg-orange-900">
                      <Package className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium">{order.id}</div>
                      <div className="text-sm text-muted-foreground">{order.date}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={order.status === "Delivered" ? "outline" : "default"}>{order.status}</Badge>
                        <span className="text-sm">
                          {order.items} {order.items === 1 ? "item" : "items"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                    <div className="font-medium text-right sm:mr-4 w-full sm:w-auto">${order.total.toFixed(2)}</div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                        <Download className="h-4 w-4 mr-2" />
                        Invoice
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <Package className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium text-lg mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-4">When you place orders, they will appear here.</p>
                <Button>Start Shopping</Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="processing">
            <div className="text-center py-10">
              <Package className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-medium text-lg mb-2">No processing orders</h3>
              <p className="text-muted-foreground">You don't have any orders currently being processed.</p>
            </div>
          </TabsContent>
          <TabsContent value="delivered">
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg"
                >
                  <div className="flex items-start gap-4 mb-4 sm:mb-0">
                    <div className="rounded-md bg-orange-100 p-2 dark:bg-orange-900">
                      <Package className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium">{order.id}</div>
                      <div className="text-sm text-muted-foreground">{order.date}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">Delivered</Badge>
                        <span className="text-sm">
                          {order.items} {order.items === 1 ? "item" : "items"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                    <div className="font-medium text-right sm:mr-4 w-full sm:w-auto">${order.total.toFixed(2)}</div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                        <Download className="h-4 w-4 mr-2" />
                        Invoice
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

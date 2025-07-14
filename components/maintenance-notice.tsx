import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface MaintenanceNoticeProps {
  feature?: string
}

export function MaintenanceNotice({ feature = "Chat Mode" }: MaintenanceNoticeProps) {
  return (
    <Alert className="bg-amber-900/20 border-amber-800 text-amber-100 mb-4">
      <AlertCircle className="h-4 w-4 text-amber-400" />
      <AlertTitle className="text-amber-300">Maintenance Notice</AlertTitle>
      <AlertDescription>
        {feature} is temporarily disabled for maintenance. We're working to restore this functionality as soon as
        possible.
      </AlertDescription>
    </Alert>
  )
}


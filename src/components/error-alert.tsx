import type { ReactNode } from "react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"

interface ErrorAlertProps {
  title: string
  description: string
  action?: ReactNode
}

export function ErrorAlert({ title, description, action }: ErrorAlertProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <p>{description}</p>
        {action}
      </AlertDescription>
    </Alert>
  )
}

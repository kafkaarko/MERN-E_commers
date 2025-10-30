"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { API } from "@/lib/axios"

export default function LoginPage() {
    const [login, setLogin] = useState({
        email: "",
        password: ""
    })
    const [error, setError] = useState('')
    let router = useRouter()

     async function loginProcced(e: React.FormEvent){  
        e.preventDefault()

        try {
            const res = await API.post('user/login', login, {
                withCredentials: true // biar cookie dari bakend tinggal masuk
            }) 
            console.log("login berhasil", res.data)
            router.push('/')
        } catch (error: unknown) {
            setError(error.response?.data?.message || "login failed")
        }

            
    }

  return (
    <form action="" onSubmit={loginProcced}>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">Sign in</CardTitle>

          <CardDescription className="text-muted-foreground">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" className="w-full" value={login.email} onChange={(e: React.FormEvent) => setLogin({...login, email:e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter your password" className="w-full" value={login.password} onChange={(e: React.FormEvent) => setLogin({...login, password:e.target.value})} />
          </div>
          <Button className="w-full" size="default" type="submit">
            Sign in
          </Button>
          {error && <p>{error}</p>}
        </CardContent>
      </Card>
    </div>
    </form>
  )
}

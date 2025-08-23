"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, User, Lock, Mail } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [modal, setModal] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    // Simular processo de autenticação
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
  }
    useEffect(() => {
      const checkToken = async () => {
        if (typeof window === "undefined") return;

        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        try {
          const res = await fetch(`/api/users/token/${token}`);
          const data = await res.json();
          console.log("Usuário autenticado com UUID:", data.uuid);
          window.location.href = `/${data.uuid}`;

        } catch (err) {
          console.error("Erro ao validar token:", err);

        }
      };

      checkToken();
    }, []);

  const cadastrar = async () => {
    setIsLoading(true)
    console.log(name, password, confirmPassword)
    if (name != "estevao" && name != "luana" && name != "lu") {
      return alert("Esse nome de usuário não pode ser usado, tente outro.")
    }

    try {
      const response = await fetch("/api/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, password, confirmPassword }),
      })
      const data = await response.json()
      alert(data)
      console.log(data)
      if (response.ok) {
        setModal(true)
        localStorage.setItem("token", data.token)
        router.push(`/${data.uuid}`)
      }
      setIsLoading(false)
    } catch (error) {
      console.error("Erro ao cadastrar:", error)
      alert("Erro ao cadastrar, tente novamente.")
      setIsLoading(false)
      return
    }
  }


  const login = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, password }),
      })
      const data = await response.json()
      alert(data.message || data.error)
      if (response.ok) {
        setModal(true)
        localStorage.setItem("token", data.token)
        router.push(`/${data.uuid}`)
      }
      setIsLoading(false)
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      console.log("Erro ao fazer login:", error)
      alert("Erro ao fazer login, tente novamente.")
      setIsLoading(false)
      return
    }
  }


  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div
        className="polaroid polaroid-scattered top-10 left-10 w-35 h-45 floating"
        style={{ "--rotation": "-15deg" }}
      >
        <img
          src="/login/foto1.jpeg"
          className="w-full h-30 object-cover rounded-sm"
        />
      </div>

      <div
        className="polaroid polaroid-scattered top-20 right-16 w-28 h-32 floating"
        style={{ "--rotation": "12deg", animationDelay: "1s" }}
      >
        <img
          src="/login/foto3.jpeg"
          className="w-full h-20 object-cover rounded-sm"
        />
      </div>

      <div
        className="polaroid polaroid-scattered bottom-32 left-20 w-26 h-30 floating"
        style={{ "--rotation": "8deg", animationDelay: "2s" }}
      >
        <img
          src="/login/foto5.jpeg"
          className="w-full h-18 object-cover rounded-sm"
        />
      </div>

      <div
        className="polaroid polaroid-scattered bottom-20 right-12 w-24 h-28 floating"
        style={{ "--rotation": "-10deg", animationDelay: "0.5s" }}
      >
        <img
          src="/login/foto8.jpeg"
          className="w-full h-16 object-cover rounded-sm"
        />
      </div>

      <div
        className="polaroid polaroid-scattered top-1/2 left-8 w-40 h-35 floating"
        style={{ "--rotation": "18deg", animationDelay: "1.5s" }}
      >
        <img
          src="/login/foto11.jpeg"
          className="w-full h-25 object-cover rounded-sm"
        />
      </div>

      <div
        className="polaroid polaroid-scattered top-1/3 right-8 w-40 h-50 floating"
        style={{ "--rotation": "-8deg", animationDelay: "2.5s" }}
      >
        <img
          src="/login/foto12.jpeg"
          className="w-full h-30 object-cover rounded-sm"
        />
      </div>
      <div className="auth-container flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Heart className="h-8 w-8 text-primary fill-current" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Bem-vindos</h1>
            <p className="text-muted-foreground">Entre na sua conta ou crie uma nova para continuar</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="border-2 border-border/50 shadow-lg">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl text-center">Entrar</CardTitle>
                  <CardDescription className="text-center">
                    Digite suas credenciais para acessar sua conta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-name">Nome</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="login-email" type="text" placeholder="nome" className="pl-10" onChange={(e) => setName(e.target.value)} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="login-password" type="password" placeholder="••••••••" onChange={(e) => setPassword(e.target.value)} className="pl-10" required />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      disabled={isLoading}
                      onClick={login}
                    >
                      {isLoading ? "Entrando..." : "Entrar"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card className="border-2 border-border/50 shadow-lg">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl text-center">Cadastrar</CardTitle>
                  <CardDescription className="text-center">Crie sua conta para começar sua jornada</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Nome</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-name"
                          type="text"
                          placeholder="Seu nome completo"
                          className="pl-10"
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      disabled={isLoading}
                      onClick={() => cadastrar()}
                    >
                      {isLoading ? "Criando conta..." : "Criar conta"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Feito com <Heart className="inline h-4 w-4 text-primary fill-current mx-1" /> para você
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

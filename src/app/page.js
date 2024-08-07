"use client";
import React, { useState, useEffect } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Checkbox,
  Input,
} from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Importa useRouter
import { MailIcon } from "@/components/MailIcon";
import { LockIcon } from "@/components/LockIcon";
import { login } from "@/services/authService";

export default function Home() {
  const router = useRouter(); // Inicializa useRouter
  const currentYear = new Date().getFullYear();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  // Simulación de verificación de token
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const handleLogin = async () => {
    try {
      const token = await login(username, password);
      localStorage.setItem("token", token);
      setToken(token);
      // Redirige al usuario después de un inicio de sesión exitoso
      router.push("/admin/all"); // Usa router.push en lugar de window.location.href
      onOpenChange(false);
    } catch (error) {
      setError("Credenciales incorrectas");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <navbar>
        <Navbar className="bg-gray-800">
          <NavbarBrand className="text-blue-50">
            Resultados - Estilos de Aprendizaje
          </NavbarBrand>
          <NavbarContent justify="end">
            <NavbarItem>
              {token ? (
                <Button
                  as={Link}
                  color="primary"
                  href="/admin/all"
                  variant="flat"
                >
                  Ir al Dashboard
                </Button>
              ) : (
                <Button onPress={onOpen} color="warning" variant="flat">
                  Iniciar Sesión
                </Button>
              )}
            </NavbarItem>
          </NavbarContent>
        </Navbar>
      </navbar>
      <main
        className="flex-1 bg-cover bg-center"
        style={{
          backgroundImage: `url(/img/banner-cetmar18.jpg)`,
        }}
      >
        <Modal
          isOpen={isOpen}
          onOpenChange={() => {
            onOpenChange(!isOpen);
            setError(""); // Limpiar el mensaje de error al abrir el modal
          }}
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Iniciar Sesión
                </ModalHeader>
                <ModalBody>
                  {error && <p className="text-danger text-sm mb-2">{error}</p>}
                  <Input
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                    endContent={
                      <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    label="Usuario"
                    placeholder="Ingrese su usuario"
                    variant="bordered"
                    className="text-gray-950"
                  />
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    endContent={
                      <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    label="Contraseña"
                    placeholder="Ingrese su contraseña"
                    type="password"
                    variant="bordered"
                    className="text-gray-950"
                  />
                  <div className="flex py-2 px-1 justify-between">
                    <Checkbox classNames={{ label: "text-small" }}>
                      Recordar datos
                    </Checkbox>
                    <Link color="primary" href="#" size="sm">
                      ¿Olvidó la contraseña?
                    </Link>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="flat"
                    onClick={() => onOpenChange(false)}
                  >
                    Cerrar
                  </Button>
                  <Button color="primary" onClick={handleLogin}>
                    Iniciar Sesión
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </main>
      <footer className="bg-gray-800 text-slate-100 text-center text-xs p-3">
        <p>© {currentYear} - Resultados - Estilos de Aprendizaje - CETMAR18</p>
      </footer>
    </div>
  );
}

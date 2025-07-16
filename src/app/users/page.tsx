'use client';

import { useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Mail, MapPin } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  address: { city: string };
}

const userSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  email: z.string().email({ message: 'Email inválido' }),
  city: z.string().optional(),
});

type UserForm = z.infer<typeof userSchema>;

function useUsers(queryClient: ReturnType<typeof useQueryClient>, enabled: boolean) {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!res.ok) throw new Error('Erro ao buscar usuários');
      return res.json() as Promise<User[]>;
    },
    staleTime: 1000 * 60 * 60,
    enabled,
    onSuccess: (data: User[]) => {
      queryClient.setQueryData(['users'], data);
    },
  } as UseQueryOptions<User[], Error>);
}

export default function UsersPage() {
  const [mounted, setMounted] = React.useState(false);
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useUsers(queryClient, mounted);
  const [open, setOpen] = React.useState(false);
  const [editUser, setEditUser] = React.useState<User | null>(null);
  const [search, setSearch] = React.useState(""); // Estado do filtro de busca
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
  });
  React.useEffect(() => { setMounted(true); }, []);
  React.useEffect(() => {
    if (editUser) {
      reset({
        name: editUser.name,
        email: editUser.email,
        city: editUser.address.city,
      });
    } else {
      reset();
    }
  }, [editUser, reset, open]);
  if (!mounted) return null;

  // Filtra os usuários pelo nome digitado
  const filteredUsers = (data || []).filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  function onSubmit(values: UserForm) {
    if (editUser) {
      // Editar usuário existente
      const updatedUsers = (data || []).map((u) =>
        u.id === editUser.id
          ? { ...u, name: values.name, email: values.email, address: { city: values.city || '' } }
          : u
      );
      queryClient.setQueryData<User[]>(['users'], updatedUsers);
      setEditUser(null);
      setOpen(false);
      reset();
      return;
    }
    const newUser: User = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Math.floor(Math.random() * 100000)),
      name: values.name,
      email: values.email,
      address: { city: values.city || '' },
    };
    // Adiciona o novo usuário no topo da lista
    const updatedUsers = [newUser, ...(data || [])];
    queryClient.setQueryData<User[]>(['users'], updatedUsers);
    setOpen(false);
    setEditUser(null);
    reset();
  }

  function handleDeleteUser(id: string) {
    const updatedUsers = (data || []).filter((u) => u.id !== id);
    queryClient.setQueryData<User[]>(['users'], updatedUsers);
  }

  return (
    <div className="min-h-dvh flex flex-col items-center text-white px-4 py-10 bg-gradient-to-br from-black via-fuchsia-900 via-40% to-indigo-950">
      <div className="w-full max-w-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl sm:text-5xl font-bold text-fuchsia-400 text-center sm:text-left"> Usuários</h1>
        <Dialog open={open} onOpenChange={(v) => {
          setOpen(v);
          if (v) {
            setEditUser(null); // Garante que ao abrir para novo usuário, os campos venham limpos
            reset();
          }
        }}>
          <DialogTrigger asChild>
            <Button
              className="mt-6 sm:mt-0 sm:ml-6 px-6 py-3 rounded-full bg-gradient-to-r from-fuchsia-600 via-purple-500 to-indigo-500 text-lg font-semibold text-white shadow-lg border-none cursor-pointer"
              aria-label="Abrir modal de novo usuário"
              onClick={() => {
                setEditUser(null);
                setOpen(true);
              }}
            >
              + Novo usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Usuário</DialogTitle>
              <DialogDescription>Preencha os campos para adicionar um novo usuário.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-white" htmlFor="name">Nome *</label>
                <input
                  id="name"
                  aria-label="Nome"
                  className="w-full rounded-md px-3 py-2 bg-black/60 border border-fuchsia-700 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                  {...register('name')}
                  disabled={isSubmitting}
                />
                {errors.name && <span className="text-red-400 text-sm">{errors.name.message}</span>}
              </div>
              <div>
                <label className="block mb-1 font-medium text-white" htmlFor="email">Email *</label>
                <input
                  id="email"
                  aria-label="Email"
                  className="w-full rounded-md px-3 py-2 bg-black/60 border border-fuchsia-700 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                  {...register('email')}
                  disabled={isSubmitting}
                />
                {errors.email && <span className="text-red-400 text-sm">{errors.email.message}</span>}
              </div>
              <div>
                <label className="block mb-1 font-medium text-white" htmlFor="city">Cidade</label>
                <input
                  id="city"
                  aria-label="Cidade"
                  className="w-full rounded-md px-3 py-2 bg-black/60 border border-fuchsia-700 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                  {...register('city')}
                  disabled={isSubmitting}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting} className="w-full mt-2" aria-label="Salvar usuário">
                  {isSubmitting ? 'Salvando...' : 'Salvar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="w-full max-w-2xl bg-black/70 rounded-xl shadow-lg p-6">
        {/* Campo de busca */}
        <input
          type="text"
          placeholder="Buscar usuário pelo nome..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-6 w-full rounded-md border border-fuchsia-700 bg-black/60 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          aria-label="Buscar usuário pelo nome"
        />
        {isLoading && <div className="text-center py-8">Carregando usuários...</div>}
        {isError && <div className="text-center py-8 text-red-400">Erro: {(error as Error).message}</div>}
        {data && (
          <div className="flex flex-col gap-6">
            {filteredUsers.length === 0 && (
              <div className="text-center text-gray-400 py-8">Nenhum usuário encontrado.</div>
            )}
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-black/80 border border-fuchsia-700 rounded-2xl p-5 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:border-fuchsia-400 transition-all duration-200 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                {/* Avatar com iniciais */}
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-fuchsia-700 flex items-center justify-center text-2xl font-bold text-white mx-auto sm:mx-0">
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                {/* Info centralizada */}
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
                  <div className="font-bold text-lg text-fuchsia-200">{user.name}</div>
                  <div className="text-sm text-gray-300 flex items-center justify-center gap-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {user.email}
                  </div>
                  <div className="text-xs text-gray-400 mb-2 flex items-center justify-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    {user.address.city}
                  </div>
                </div>
                {/* Ações alinhadas à direita */}
                <div className="flex flex-row sm:flex-col gap-2 sm:ml-auto justify-center sm:justify-end items-center">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-transparent cursor-pointer"
                    aria-label={`Editar usuário ${user.name}`}
                    onClick={() => {
                      setEditUser(user);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="w-5 h-5 text-gray-500" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-transparent cursor-pointer"
                    aria-label={`Excluir usuário ${user.name}`}
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash2 className="w-5 h-5 text-gray-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
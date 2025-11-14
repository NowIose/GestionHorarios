import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    Shield,
    Users,
    BookOpen,
    Calendar,
    ClipboardList,
    Home,
} from 'lucide-react';

/* ✅ Tipo extendido para coincidir con los datos compartidos por Laravel */
interface ExtendedUser {
    id: number;
    name: string;
    email: string;
    registro?: number;
    role?: {
        id: number;
        nombre: string;
    };
    permissions?: string[];
}

/* ✅ Botones base visibles para todos los usuarios autenticados */
const baseItems: NavItem[] = [
    {
        title: 'Dashboard General',
        href: '/dashboard',
        icon: LayoutGrid,
    },
];

/* ✅ Botones por rol con rutas actualizadas y botón de panel */
const menuOptions: Record<string, NavItem[]> = {
    administrador: [
       // { title: 'Panel Admin', href: '/admin/dashboard', icon: Shield },
    ],
    docente: [
        { title: 'Panel Docente', href: '/docente/dashboard', icon: Home },
        { title: 'Mis Materias', href: '/docente/materias', icon: BookOpen },
        { title: 'Mis Horarios', href: '/docente/horarios', icon: Calendar },
        { title: 'Asistencias', href: '/docente/asistencias', icon: ClipboardList },
    ],
    'director de carrera': [
        { title: 'Panel Director de Carrera', href: '/director/dashboard', icon: Home },
        { title: 'Gestión de Grupos', href: '/director/grupos', icon: Users },
        { title: 'Gestión de Horarios', href: '/director/horarios', icon: Calendar },
        { title: 'Asignar Materias', href: '/director/asignaciones', icon: BookOpen },
    ],
    decano: [
        { title: 'Panel Decano', href: '/decano/dashboard', icon: Home },
        { title: 'Supervisar Facultades', href: '/decano/facultades', icon: Shield },
        { title: 'Reportes Generales', href: '/decano/reportes', icon: ClipboardList },
    ],
    vicedecano: [
        { title: 'Panel Vicedecano', href: '/vicedecano/dashboard', icon: Home },
        { title: 'Control Académico', href: '/vicedecano/academico', icon: BookOpen },
        { title: 'Gestión Docente', href: '/vicedecano/docentes', icon: Users },
    ],
};

export function NavMain({ items = [] }: { items?: NavItem[] }) {
    // ✅ Obtenemos usuario autenticado y sus datos (rol, permisos, etc.)
    const page = usePage();
    const { props } = page as unknown as { props: { auth: { user?: Partial<ExtendedUser> | null } } };
    const url = (page as any).url || '';

    const user = props.auth?.user;
    const role = user?.role?.nombre?.toLowerCase() ?? '';

    // ✅ Construcción dinámica del menú según el rol
    let dynamicItems: NavItem[] = [...baseItems];

    // Si NO es docente → agregar acceso al panel admin
    if (role !== 'docente' ) {
        dynamicItems.push({
            title: 'Panel Admin',
            href: '/admin/dashboard',
            icon: Shield,
        });
    }

// Si es docente → agregar solo los botones del docente
if (menuOptions[role]) {
    dynamicItems.push(...menuOptions[role]);
}


    // ✅ No combinamos con los items externos (para evitar duplicados)
    const allItems = dynamicItems;

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Menú Principal</SidebarGroupLabel>
            <SidebarMenu>
                {allItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={url.startsWith(resolveUrl(item.href))}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}

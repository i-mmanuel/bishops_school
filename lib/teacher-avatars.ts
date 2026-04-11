// Hard-coded teacher avatar URLs keyed by teacher name (exact match against the
// `name` field returned by the API). Falls back to a pravatar placeholder for
// any teacher not in this map.

const TEACHER_AVATARS: Record<string, string> = {
  'Apostle Joel': '/teachers/apostle-joel.jpg',
  'Bishop Richard': '/teachers/bishop-richard.jpg',
  'Bishop Nterful': '/teachers/bishop-nterful.jpg',
}

export function teacherAvatar(teacher: { id: number; name: string }): string {
  return TEACHER_AVATARS[teacher.name] ?? `https://i.pravatar.cc/160?u=${teacher.id}`
}

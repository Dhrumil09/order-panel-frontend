export const createPageMeta = (title: string, description: string) => {
  return [
    { title: `${title} - Admin Panel` },
    {
      name: "description",
      content: description,
    },
  ];
}; 
// Public sample data never grants access to live Cloud records.
export const demoAdmin = {
  email: "sample-admin@example.com",
  password: "AnconDemo123",
};

export function isDemoLogin(email: string, password: string) {
  return email.trim().toLowerCase() === demoAdmin.email && password === demoAdmin.password;
}

export const demoProjects = [
  { id: "sample-project", project_name: "Sample residence", client_name: "Sample client", project_type: "Residential", status: "Design", budget: 1200000 },
];
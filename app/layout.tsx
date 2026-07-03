import "./globals.css";

export const metadata = {
  title: "Project LOOP",
  description: "AI Customer Feedback Intelligence Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#070A12] text-white">
        {children}
      </body>
    </html>
  );
}
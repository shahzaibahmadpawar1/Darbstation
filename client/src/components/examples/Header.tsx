import Header from "../Header";

export default function HeaderExample() {
  return (
    <Header
      onLogout={() => console.log("Logout clicked")}
      onMenuClick={() => console.log("Menu clicked")}
      showMenuButton={true}
    />
  );
}

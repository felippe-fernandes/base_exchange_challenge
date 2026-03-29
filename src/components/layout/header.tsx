import { ReseedDatabaseButton } from "./reseedDatabaseButton";
import { UserSettingsMenu } from "./userSettingsMenu";

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <h1 className="text-lg font-semibold tracking-tight">
          BASE Exchange
        </h1>
        <div className="flex items-center gap-2">
          <ReseedDatabaseButton />
          <UserSettingsMenu />
        </div>
      </div>
    </header>
  );
}

import * as path from 'path'
import { promises as fs } from 'fs'
import { fileURLToPath } from 'url'
import { Migrator } from 'kysely'
import type { Migration, MigrationProvider } from 'kysely'
import { db } from '.'

class ESMFileMigrationProvider implements MigrationProvider {
    constructor(private relativePath: string) { }

    async getMigrations(): Promise<Record<string, Migration>> {
        const migrations: Record<string, Migration> = { };
        const __dirname = fileURLToPath(new URL(".", import.meta.url));
        const resolvedPath = path.resolve(__dirname, this.relativePath);
        const files = await fs.readdir(resolvedPath);

        for (const fileName of files) {
            if (!fileName.endsWith(".js")) {
                continue;
            }

            const importPath = path.join(this.relativePath, fileName).replaceAll("\\", "/");
            const migration = await import(importPath);
            const migrationKey = fileName.substring(0, fileName.lastIndexOf("."));

            migrations[migrationKey] = migration;
        }

        return migrations;
    }
}

export async function migrateToLatest() {
  const migrator = new Migrator({
    db,
    provider: new ESMFileMigrationProvider("./migrations"),
  })
  const { error, results } = await migrator.migrateToLatest()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`)
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error('failed to migrate')
    console.error(error)
    process.exit(1)
  }

  await db.destroy()
}
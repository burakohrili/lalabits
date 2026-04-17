import { MigrationInterface, QueryRunner } from 'typeorm';

const VERSION_DATE = '2026-03-01';

const DOCS = [
  { document_type: 'terms_of_service', version_identifier: VERSION_DATE, effective_date: VERSION_DATE },
  { document_type: 'privacy_policy', version_identifier: VERSION_DATE, effective_date: VERSION_DATE },
  { document_type: 'creator_agreement', version_identifier: VERSION_DATE, effective_date: VERSION_DATE },
];

export class SeedLegalDocumentVersions1775900009000 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    for (const doc of DOCS) {
      const existing = await queryRunner.query(
        `SELECT id FROM legal_document_versions WHERE document_type = $1 AND is_current = true`,
        [doc.document_type],
      );
      if (existing.length > 0) continue;

      await queryRunner.query(
        `INSERT INTO legal_document_versions (document_type, version_identifier, effective_date, is_current)
         VALUES ($1, $2, $3, true)`,
        [doc.document_type, doc.version_identifier, doc.effective_date],
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM legal_document_versions WHERE version_identifier = $1`,
      [VERSION_DATE],
    );
  }
}

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

// Idempotency log for gateway webhook events.
// Unique constraint on (gateway, idempotency_key) prevents double-processing.
@Entity('webhook_events')
export class WebhookEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  gateway: string; // 'iyzico'

  @Column({ type: 'varchar' })
  event_type: string;

  // Unique key: gateway-provided ID (paymentId or referenceCode) + eventType
  @Column({ type: 'varchar', unique: true })
  idempotency_key: string;

  @Column({ type: 'jsonb' })
  raw_payload: object;

  @Column({ default: false })
  processed: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  processed_at: Date | null;

  @Column({ type: 'text', nullable: true })
  error: string | null; // null = success; non-null = processing error

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}

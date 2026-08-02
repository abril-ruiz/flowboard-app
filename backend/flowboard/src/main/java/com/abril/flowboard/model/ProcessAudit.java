package com.abril.flowboard.model;
import com.abril.flowboard.enums.ProcessStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "process_audit")
// Registro histórico de cambios de estado de un proceso
public class ProcessAudit {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "process_id", nullable = false)
    private Process process;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProcessStatus oldStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProcessStatus newStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "changed_by")
    private User changedBy;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime changedAt;

    private String comment;
    // Getters y setters
    public Long getId() { return id; }
    public Process getProcess() { return process; }
    public void setProcess(Process process) { this.process = process; }
    public ProcessStatus getOldStatus() { return oldStatus; }
    public void setOldStatus(ProcessStatus oldStatus) { this.oldStatus = oldStatus; }
    public ProcessStatus getNewStatus() { return newStatus; }
    public void setNewStatus(ProcessStatus newStatus) { this.newStatus = newStatus; }
    public User getChangedBy() { return changedBy; }
    public void setChangedBy(User changedBy) { this.changedBy = changedBy; }
    public LocalDateTime getChangedAt() { return changedAt; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}

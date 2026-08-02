package com.abril.flowboard.dto;
import com.abril.flowboard.enums.ProcessStatus;
public record ProcessFilterRequest(ProcessStatus status, Long createdById, Long tagId) {
    
}

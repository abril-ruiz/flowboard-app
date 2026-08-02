package com.abril.flowboard.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ProcessRequestValidationTest {

    private final Validator validator;

    ProcessRequestValidationTest() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void shouldRejectTitleLongerThan100Characters() {
        ProcessRequest request = new ProcessRequest("a".repeat(101), "description");

        Set<ConstraintViolation<ProcessRequest>> violations = validator.validate(request);

        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("100")));
    }

    @Test
    void shouldRejectDescriptionLongerThan1000Characters() {
        ProcessRequest request = new ProcessRequest("title", "b".repeat(1001));

        Set<ConstraintViolation<ProcessRequest>> violations = validator.validate(request);

        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().contains("1000")));
    }
}

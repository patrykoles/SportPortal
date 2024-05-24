package com.example.Sportifyback.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class FilterDto {
    private String sport;
    private String startDate;
    private String endDate;
    private String startTime;
    private String endTime;
}

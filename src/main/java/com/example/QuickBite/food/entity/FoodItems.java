package com.example.QuickBite.food.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "food_items")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FoodItems {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Food name is required")
    private String name;

    private String description;

    @NotNull(message = "Food price is required")
    private Double price;

    private String category;

    private Integer quantity;

    private Boolean available;

    private String imageUrl;
}

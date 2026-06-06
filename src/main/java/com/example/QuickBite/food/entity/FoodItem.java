package com.example.QuickBite.food.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "food_items")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "dtype", discriminatorType = DiscriminatorType.STRING)
@DiscriminatorValue("FoodItem")
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class FoodItem {

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

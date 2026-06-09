package com.example.QuickBite.order.service;

import com.example.QuickBite.enums.OrderStatus;
import com.example.QuickBite.food.entity.FoodItems;
import com.example.QuickBite.food.repository.FoodRepository;
import com.example.QuickBite.order.dto.*;
import com.example.QuickBite.order.entity.Order;
import com.example.QuickBite.order.entity.OrderItem;
import com.example.QuickBite.order.repository.OrderItemRepository;
import com.example.QuickBite.order.repository.OrderRepository;
import com.example.QuickBite.user.entity.User;
import com.example.QuickBite.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final FoodRepository foodRepository;

//    User Operations
    @Override
    public OrderResponseDTO placeOrder(PlaceOrderRequestDTO request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(
                        ()->new RuntimeException("User Not Found!")
                );

        double totalAmount = 0.0;

        for(PlaceOrderItemDTO item : request.getItems())
        {
            FoodItems food = foodRepository.findById(
                    item.getFoodItemId()
            ).orElseThrow(
                    () -> new RuntimeException("Food Not Found!")
            );

            if(!food.getAvailable())
            {
                throw new RuntimeException(
                        food.getName() + " is not available"
                );
            }

            if(food.getQuantity() < item.getQuantity())
            {
                throw new RuntimeException(
                        "Insufficent stock for " + food.getName()
                );
            }

            totalAmount += food.getPrice() * item.getQuantity();

        }

        Order order = Order.builder()
                .tokenNumber(generateToken())
                .totalAmount(totalAmount)
                .orderStatus(OrderStatus.PENDING)
                .orderTime(java.time.LocalDateTime.now())
                .user(currentUser)
                .build();

        Order saveOrder = orderRepository.save(order);

        for(PlaceOrderItemDTO item : request.getItems())
        {
            FoodItems food = foodRepository.findById(
                    item.getFoodItemId()
            ).orElseThrow(
                    () -> new RuntimeException("Food Not Found!")
            );

            double subTotal = food.getPrice() * item.getQuantity();

            OrderItem orderItem = OrderItem.builder()
                    .order(saveOrder)
                    .foodItem(food)
                    .quantity(item.getQuantity())
                    .price(food.getPrice())
                    .subtotal(subTotal)
                    .build();

            orderItemRepository.save(orderItem);

            food.setQuantity(food.getQuantity() - item.getQuantity());

            if(food.getQuantity() <= 0)
            {
                food.setQuantity(0);
                food.setAvailable(false);
            }

            foodRepository.save(food);
        }
        return mapToResponseDTO(saveOrder);
    }


    @Override
    public List<OrderResponseDTO> getUserOrders() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        System.out.println("EMAIL FROM TOKEN = " + email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User Not Found!"));

        System.out.println("DB USER ID = " + user.getId());

        List<Order> orders = orderRepository.findByUser(user);

        return orders.stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    @Override
    public OrderDetailsResponseDTO getOrderById(Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(
                        ()-> new RuntimeException("User Not Found!")
                );

        Order order = orderRepository.findByIdAndUser(id,currentUser)
                .orElseThrow(
                        () -> new RuntimeException("Order Not Found!")
                );
        List<OrderItem> orderItems = orderItemRepository.findByOrder(order);

        List<OrderItemResponseDTO> itemDTOs = orderItems.stream()
                .map(item -> OrderItemResponseDTO.builder()
                        .id(item.getId())
                        .foodName(item.getFoodItem().getName())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .subtotal(item.getSubtotal())
                        .build()
                )
                .toList();

        return mapToOrderDetailsDTO(order,itemDTOs);
    }

    @Override
    public OrderResponseDTO cancelOrder(Long id)
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(
                        ()-> new RuntimeException("User Not Found!")
                );

        Order order = orderRepository.findByIdAndUser(id,currentUser)
                .orElseThrow(
                        ()-> new RuntimeException("Order Not Found!")
                );

        if(order.getOrderStatus() != OrderStatus.PENDING)
        {
            throw new RuntimeException("Only PENDING orders can be cancelled!");
        }
        order.setOrderStatus(OrderStatus.CANCELLED);

        Order cacelledOrder = orderRepository.save(order);
        return mapToResponseDTO(cacelledOrder);

    }



    //  Admin operations
    @Override
    public List<OrderResponseDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(this::mapToResponseDTO).toList();
    }

    @Override
    public OrderDetailsResponseDTO getOrdersById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(
                        ()-> new RuntimeException("Order Not Found!")
                );
        List<OrderItem> orderItems = orderItemRepository.findByOrder(order);

        List<OrderItemResponseDTO> itemDTOs = orderItems.stream()
                .map(item ->
                        OrderItemResponseDTO.builder()
                                .id(item.getId())
                                .quantity(item.getQuantity())
                                .price(item.getPrice())
                                .subtotal(item.getSubtotal())
                                .foodName(item.getFoodItem().getName())
                                .build()
                ).toList();
        return mapToOrderDetailsDTO(order,itemDTOs);
    }

    @Override
    public List<OrderResponseDTO> getOrdersByStatus(OrderStatus status) {
        List<Order> orders = orderRepository.findByOrderStatus(status);
        return orders.stream()
                .map(this::mapToResponseDTO).toList();
    }

    @Override
    public OrderResponseDTO updateOrderStatus(Long orderId, UpdateOrderStatusRequestDTO requestDTO) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(
                        ()-> new RuntimeException("Order Not Found!")
                );
        order.setOrderStatus(requestDTO.getStatus());
        Order updateOrder = orderRepository.save(order);
        return mapToResponseDTO(updateOrder);
    }

    @Override
    public String generateToken() {
        long count = orderRepository.count();
        return "TK" + (count + 1);
    }

    private OrderResponseDTO mapToResponseDTO(Order order) {
        return OrderResponseDTO
                .builder()
                .id(order.getId())
                .status(order.getOrderStatus())
                .tokenNumber(order.getTokenNumber())
                .totalAmount(order.getTotalAmount())
                .orderTime(order.getOrderTime())
                .build();
    }

    private OrderDetailsResponseDTO mapToOrderDetailsDTO(
            Order order, List<OrderItemResponseDTO> items) {

        return OrderDetailsResponseDTO.builder()
                .id(order.getId())
                .tokenNumber(order.getTokenNumber())
                .totalAmount(order.getTotalAmount())
                .status(order.getOrderStatus())
                .orderTime(order.getOrderTime())
                .items(items)
                .build();
    }

}
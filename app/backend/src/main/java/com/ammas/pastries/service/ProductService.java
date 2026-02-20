package com.ammas.pastries.service;

import com.ammas.pastries.dto.ProductDTO;
import com.ammas.pastries.dto.ProductRequest;
import com.ammas.pastries.entity.Product;
import com.ammas.pastries.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(ProductDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public Page<ProductDTO> getProducts(String category, String search, String sortBy, String sortOrder, int page, int size) {
        Sort sort = Sort.by(sortOrder.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC, 
                            sortBy.equals("price") ? "price" : "name");
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Product> products;
        if ((category == null || category.isEmpty()) && (search == null || search.isEmpty())) {
            products = productRepository.findAll(pageable);
        } else {
            products = productRepository.findByCategoryAndSearch(
                category != null && !category.isEmpty() ? category : null,
                search != null && !search.isEmpty() ? search : null,
                pageable
            );
        }
        
        return products.map(ProductDTO::fromEntity);
    }
    
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return ProductDTO.fromEntity(product);
    }
    
    public List<ProductDTO> getFeaturedProducts() {
        return productRepository.findByFeaturedTrue().stream()
                .map(ProductDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<ProductDTO> getProductsByCategory(String category) {
        return productRepository.findByCategory(category).stream()
                .map(ProductDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<String> getAllCategories() {
        return productRepository.findAllCategories();
    }
    
    @Transactional
    public ProductDTO createProduct(ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());
        product.setStock(request.getStock());
        product.setFeatured(request.getFeatured());
        
        Product savedProduct = productRepository.save(product);
        return ProductDTO.fromEntity(savedProduct);
    }
    
    @Transactional
    public ProductDTO updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());
        product.setStock(request.getStock());
        product.setFeatured(request.getFeatured());
        
        Product updatedProduct = productRepository.save(product);
        return ProductDTO.fromEntity(updatedProduct);
    }
    
    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }
}

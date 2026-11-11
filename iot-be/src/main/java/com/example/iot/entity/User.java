package com.example.iot.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "studentId")
    private String studentId;

    @Column(name = "email")
    private String email;

    @Column(name = "tel")
    private String tel;

    @Column(name = "avatarUrl")
    private String avatarUrl;

    @Column(name = "linkGithub")
    private String linkGithub;

    @Column(name = "linkFigma")
    private String linkFigma;

    @Column(name = "linkReport")
    private String linkReport;

    @Column(name = "linkPostman")
    private String linkPostman;

    @Column(name = "username", unique = true, length = 50)
    private String username;

    @Column(name = "password", length = 255)
    private String password;
}

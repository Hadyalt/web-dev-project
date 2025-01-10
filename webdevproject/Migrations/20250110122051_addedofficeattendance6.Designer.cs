﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using StarterKit.Models;

#nullable disable

namespace webdevproject.Migrations
{
    [DbContext(typeof(DatabaseContext))]
    [Migration("20250110122051_addedofficeattendance6")]
    partial class addedofficeattendance6
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "9.0.0");

            modelBuilder.Entity("StarterKit.Models.Admin", b =>
                {
                    b.Property<int>("AdminId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("UserRole")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("AdminId");

                    b.HasIndex("UserName")
                        .IsUnique();

                    b.ToTable("Admin");

                    b.HasData(
                        new
                        {
                            AdminId = 1,
                            Email = "admin1@example.com",
                            Password = "^�H��(qQ��o��)'s`=\rj���*�rB�",
                            UserName = "admin1",
                            UserRole = "admin"
                        },
                        new
                        {
                            AdminId = 2,
                            Email = "admin2@example.com",
                            Password = "\\N@6��G��Ae=j_��a%0�QU��\\",
                            UserName = "admin2",
                            UserRole = "admin"
                        },
                        new
                        {
                            AdminId = 3,
                            Email = "admin3@example.com",
                            Password = "�j\\��f������x�s+2��D�o���",
                            UserName = "admin3",
                            UserRole = "admin"
                        },
                        new
                        {
                            AdminId = 4,
                            Email = "admin4@example.com",
                            Password = "�].��g��Պ��t��?��^�T��`aǳ",
                            UserName = "admin4",
                            UserRole = "admin"
                        },
                        new
                        {
                            AdminId = 5,
                            Email = "admin5@example.com",
                            Password = "E�=���:�-����gd����bF��80]�",
                            UserName = "admin5",
                            UserRole = "admin"
                        });
                });

            modelBuilder.Entity("StarterKit.Models.Attendance", b =>
                {
                    b.Property<int>("AttendanceId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("AttendanceDate")
                        .HasColumnType("TEXT");

                    b.Property<int>("UserId")
                        .HasColumnType("INTEGER");

                    b.HasKey("AttendanceId");

                    b.HasIndex("AttendanceId")
                        .IsUnique();

                    b.HasIndex("UserId");

                    b.ToTable("Attendance");

                    b.HasData(
                        new
                        {
                            AttendanceId = 1,
                            AttendanceDate = new DateTime(2022, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            UserId = 1
                        });
                });

            modelBuilder.Entity("StarterKit.Models.Event", b =>
                {
                    b.Property<int>("EventId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<bool>("AdminApproval")
                        .HasColumnType("INTEGER");

                    b.Property<double>("AverageRating")
                        .HasColumnType("REAL");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<TimeSpan>("EndTime")
                        .HasColumnType("TEXT");

                    b.Property<DateOnly>("EventDate")
                        .HasColumnType("TEXT");

                    b.Property<string>("Location")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<TimeSpan>("StartTime")
                        .HasColumnType("TEXT");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("EventId");

                    b.HasIndex("EventId")
                        .IsUnique();

                    b.ToTable("Event");

                    b.HasData(
                        new
                        {
                            EventId = 1,
                            AdminApproval = true,
                            AverageRating = 0.0,
                            Description = "Description of event 1",
                            EndTime = new TimeSpan(0, 12, 0, 0, 0),
                            EventDate = new DateOnly(2022, 1, 1),
                            Location = "Location 1",
                            StartTime = new TimeSpan(0, 10, 0, 0, 0),
                            Title = "Event 1"
                        },
                        new
                        {
                            EventId = 2,
                            AdminApproval = true,
                            AverageRating = 0.0,
                            Description = "Description of event 2",
                            EndTime = new TimeSpan(0, 13, 0, 0, 0),
                            EventDate = new DateOnly(2023, 1, 1),
                            Location = "Location 2",
                            StartTime = new TimeSpan(0, 11, 0, 0, 0),
                            Title = "Event 2"
                        });
                });

            modelBuilder.Entity("StarterKit.Models.Event_Attendance", b =>
                {
                    b.Property<int>("Event_AttendanceId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("EventId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Feedback")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("Rating")
                        .HasColumnType("INTEGER");

                    b.Property<int>("UserId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Event_AttendanceId");

                    b.HasIndex("EventId");

                    b.HasIndex("Event_AttendanceId")
                        .IsUnique();

                    b.HasIndex("UserId");

                    b.ToTable("Event_Attendance");

                    b.HasData(
                        new
                        {
                            Event_AttendanceId = 1,
                            EventId = 1,
                            Feedback = "Feedback 1",
                            Rating = 5,
                            UserId = 1
                        });
                });

            modelBuilder.Entity("StarterKit.Models.Office", b =>
                {
                    b.Property<int>("OfficeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateOnly>("Date")
                        .HasColumnType("TEXT");

                    b.Property<TimeSpan>("EndTime")
                        .HasColumnType("TEXT");

                    b.Property<TimeSpan>("StartTime")
                        .HasColumnType("TEXT");

                    b.HasKey("OfficeId");

                    b.HasIndex("OfficeId")
                        .IsUnique();

                    b.ToTable("Office");

                    b.HasData(
                        new
                        {
                            OfficeId = 1,
                            Date = new DateOnly(2022, 1, 1),
                            EndTime = new TimeSpan(0, 11, 0, 0, 0),
                            StartTime = new TimeSpan(0, 10, 0, 0, 0)
                        });
                });

            modelBuilder.Entity("StarterKit.Models.Office_attendance", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateOnly>("AttendanceDate")
                        .HasColumnType("TEXT");

                    b.Property<int>("OfficeId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("UserId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.ToTable("Office_Attendance");
                });

            modelBuilder.Entity("StarterKit.Models.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("RecuringDays")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("UserRole")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("UserId");

                    b.HasIndex("UserId")
                        .IsUnique();

                    b.ToTable("User");

                    b.HasData(
                        new
                        {
                            UserId = 1,
                            Email = "10@gmail.com",
                            FirstName = "User 1",
                            LastName = "User 1",
                            Password = "^�H��(qQ��o��)'s`=\rj���*�rB�",
                            RecuringDays = "mo,tu,we,th,fr",
                            UserName = "hady",
                            UserRole = "user"
                        });
                });

            modelBuilder.Entity("StarterKit.Models.Vote", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("UserId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("VotingOptionId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("Id")
                        .IsUnique();

                    b.ToTable("Vote");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            UserId = 1,
                            VotingOptionId = 1
                        });
                });

            modelBuilder.Entity("StarterKit.Models.VotingOption", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("EndTime")
                        .HasColumnType("TEXT");

                    b.Property<string>("EventDetails")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("StartTime")
                        .HasColumnType("TEXT");

                    b.Property<int>("VoteCount")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("Id")
                        .IsUnique();

                    b.ToTable("VotingOption");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            EndTime = new DateTime(2022, 1, 2, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            EventDetails = "Event 1",
                            StartTime = new DateTime(2022, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            VoteCount = 0
                        });
                });

            modelBuilder.Entity("StarterKit.Models.Attendance", b =>
                {
                    b.HasOne("StarterKit.Models.User", null)
                        .WithMany("Attendances")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("StarterKit.Models.Event_Attendance", b =>
                {
                    b.HasOne("StarterKit.Models.Event", null)
                        .WithMany("Event_Attendances")
                        .HasForeignKey("EventId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("StarterKit.Models.User", null)
                        .WithMany("Event_Attendances")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("StarterKit.Models.Event", b =>
                {
                    b.Navigation("Event_Attendances");
                });

            modelBuilder.Entity("StarterKit.Models.User", b =>
                {
                    b.Navigation("Attendances");

                    b.Navigation("Event_Attendances");
                });
#pragma warning restore 612, 618
        }
    }
}

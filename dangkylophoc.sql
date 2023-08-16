-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 31, 2022 at 03:37 AM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `quanlykhoahoc`
--

-- --------------------------------------------------------

--
-- Table structure for table `dangkylophoc`
--

CREATE TABLE `dangkylophoc` (
  `id_lophoc` int(11) NOT NULL,
  `id_khoahoc` int(11) NOT NULL,
  `id_hocvien` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `dangkylophoc`
--

INSERT INTO `dangkylophoc` (`id_lophoc`, `id_khoahoc`, `id_hocvien`) VALUES
(14, 1, 9),
(18, 3, 1),
(63, 10, 14),
(76, 4, 1),
(78, 10, 9),
(85, 3, 14),
(95, 1, 14),
(96, 13, 19),
(97, 12, 19),
(98, 11, 19),
(99, 12, 22),
(100, 10, 22),
(101, 4, 22),
(103, 13, 14),
(104, 12, 14);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dangkylophoc`
--
ALTER TABLE `dangkylophoc`
  ADD PRIMARY KEY (`id_lophoc`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dangkylophoc`
--
ALTER TABLE `dangkylophoc`
  MODIFY `id_lophoc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

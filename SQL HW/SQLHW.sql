use sakila;

-- Turn off safe updates
SET SQL_SAFE_UPDATES = 0;

#1A
select first_name, last_name 
from actor;

#1B
select concat_ws(first_name," ", last_name) as "Actor Name" 
from actor;

#2A
select actor_id, first_name, last_name 
from actor
where first_name= "Joe";

#2B 
select * from actor
where last_name like "%gen%";

#2C
select * from actor
where last_name like "%LI%"
order by last_name, first_name;

#2D 
select country_id, country
from country
where country in ("Afghanistan", "Bangladesh", "China");

#3A
ALTER TABLE `sakila`.`actor` 
ADD COLUMN `description` BLOB NULL AFTER `first_name`;

#3B
ALTER TABLE `sakila`.`actor` 
DROP COLUMN `description`;

#4A
select last_name, count(last_name) 
from actor
group by last_name;

#4B
select last_name, count(last_name) as 'lastname count'
from actor
group by last_name
having count(last_name) > 1;

#4C
UPDATE actor SET first_name='Harpo' WHERE first_name='Groucho' and last_name= 'Williams';

#4D
UPDATE actor SET first_name='Groucho' WHERE first_name='Harpo' and last_name= 'Williams';

#5A Not sure what to do 

#6A
select * from staff;
select * from address;

select staff.first_name, staff.last_name, address.address
from staff
inner join address on 
staff.address_id = address.address_id;

#6B 
select * from payment;

select staff.first_name, staff.last_name,sum(payment.amount)  as 'Total Amount by Staff' ,payment.payment_date
from staff
inner join payment
on staff.staff_id = payment.staff_id
group by staff.staff_id;

#6C How do I count total actors?
select film.title, film_actor.actor_id
from film
inner join film_actor on
film.film_id = film_actor.film_id;

#6D
select count(*) as 'Number of Hunchback Impossible copies'
from inventory
where film_id in 
(
	select film_id
	from film
    where title in ('Hunchback Impossible')
    );

#6E
select customer.first_name, customer.last_name, sum(payment.amount) as 'Total payment'  from payment
inner join customer on payment.customer_id=customer.customer_id
group by payment.customer_id 
order by customer.last_name;

#7A
select title, language_id 
from film
where language_id in 
(
select language_id 
from language
where name = 'English')
and title like 'k%' or title like 'q%';

#7B
select first_name, last_name
from actor
where actor_id in 

(select actor_id
from film_actor
where film_id in 

(select film_id
from film
where title = 'Alone Trip'
));

#7C
select first_name, last_name, email
from customer
where address_id in 
(
select address_id
from address
where city_id in
(
select city_id
from city
where country_id in
(
select country_id
from country
where country ='Canada' 
)));

#7D
select title
from film
where film_id in 
(
select film_id
from film_category
where category_id in 
(
select category_id
from category
where name in ('Family')
));

#7E
select title, rental_duration
from film
order by rental_duration desc;

#7F
select staff.store_id, sum(payment.amount) as 'Total per store'
from payment
inner join staff
on payment.staff_id=staff.staff_id
group by staff.store_id;


#7G
select city.city, country.country,store.store_id 
from city 
join country 
on city.country_id=country.country_id 
join address
on address.city_id=city.city_id
join store 
on store.address_id=address.address_id;

#7H
select category.name as 'Genre', sum(payment.amount) As 'Gross Rev'  
from category 
join film_category 
on category.category_id =film_category.category_id 
join inventory
on inventory.film_id =film_category.film_id
join rental
on rental.inventory_id =inventory.inventory_id
join payment 
on payment.rental_id =rental.rental_id
group by category.name
order by sum(payment.amount) DESC 
limit 5;

#8
CREATE VIEW top_five_genres AS
select category.name as 'Genre', sum(payment.amount) As 'Gross Rev'  
from category 
join film_category 
on category.category_id =film_category.category_id 
join inventory
on inventory.film_id =film_category.film_id
join rental
on rental.inventory_id =inventory.inventory_id
join payment 
on payment.rental_id =rental.rental_id
group by category.name
order by sum(payment.amount) DESC 
limit 5;
-- Display view:
SELECT * FROM top_five_genres; 

-- Drop View:
DROP VIEW top_five_genres;













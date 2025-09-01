import Db from './Project/DB/DBconnection.js'

const createUsertable = `
    create table if not exists users(
    id int auto_increment primary key,
    email varchar(255) not null unique,
    password varchar(255) not null unique,
    role enum('admin', 'user', 'moderate') default 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

const createRegisterpasscode = `
    create table if not exists passcode(
    id int auto_increment primary key,
    code varchar(55) not null unique,
    assigned_email varchar(255) ,
    is_used boolean default FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;

const createUserInfo = `
    create table if not exists userInfo(
    id int auto_increment primary key,
    name varchar(255),
    employee_id varchar(255),
    User_id int,
    foreign key (User_id) references users(id) on delete cascade
)`;

const DailyAttendance = `
    create table if not exists DailyAttendance(
    id int auto_increment primary key,
    CHECK_IN varchar(50) not null,
    CHECK_OUT varchar(50) not null,
    CHECK_IN_DATE DATE NOT NULL,
    Status enum("On leave", "Absent", "Present", "Medical leave") default "Present",
    AttendanceUser_id int,
    foreign key (AttendanceUser_id) references users(id) on delete cascade,
    UNIQUE (CHECK_IN_DATE, CHECK_IN, CHECK_OUT)
    )
`

const ApplyLeave = `
    create table if not exists apply_leave(
    id int auto_increment primary key,
    user_id int not null,
    employee_id varchar(255) not null,
    name varchar(300) not null,
    request_date date not null,
    leave_type varchar(255) not null, 
    reason varchar(1000) not null,
    foreign key (user_id) references users(id) on delete cascade
    )
`

const holidays = `
    create table if not exists holidays(
    id int auto_increment primary key,
    date date not null
    )
`


// await Db.promise().query(`alter table apply_leave add column Status enum("Pending","Approved","Rejected") default "Pending" `)
// await Db.promise().query(`alter table apply_leave modify column Status enum("On leave", "Absent", "Present", "Medical leave") default "Present" `)
Db.query(createUsertable, (err) => {
    if (err) {
        if (err) return console.error('Failed to create users table:', err.message);
        console.log('Users table created or already exists.');
    }

    Db.query(createUserInfo, (err) => {
        if (err) {
            if (err) return console.error('Failed to create users table:', err.message);
            console.log('UsersInfo table created or already exists.');
        }
    })

    Db.query(DailyAttendance, (err) => {
        if (err) return console.error('Failed to create users table:', err.message);
        console.log('DailyAttendance table created or already exists.')
    })

    Db.query(createRegisterpasscode,(err)=>{
        if (err) return console.error('Failed to create Passcode table:', err.message);
        console.log('Passcode table created or already exists.')
    })
    Db.query(ApplyLeave,(err)=>{
        if (err) return console.error('Failed to create Applyleave table:', err.message);
        console.log('Applyleave table created or already exists.')
    })
    Db.query(holidays, (err) => {
        if (err) return console.error('Failed to create Holiday table:', err.message);
        console.log('holiday table created or already exists.')
    })
})

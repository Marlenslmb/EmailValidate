import { Button, TextField } from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

// Кастомный хук
const useValidation = (value, validations) => {
    const [isEmpty, setIsEmpty] = useState(true)
    const [minLengthError, setMinLengthError] = useState(true)
    const [emailError, setEmailError] = useState(false)
    const [inputValid, setInputValid] = useState(false)
    
    useEffect(() => {
        for(const validation in validations) {
            switch(validation) {
                case 'minLength':
                    value.length < validations[validation] ? setMinLengthError(true) : setMinLengthError(false)
                    break;
                    case 'isEmpty':
                        value ? setIsEmpty(false) : setIsEmpty(true)
                        break;
                        case 'isEmail': 
                        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        re.test(String(value).toLowerCase()) ? setEmailError(false) : setEmailError(true)
                        break;
                    }
                }
            }, [value])
            
            useEffect(() => {
                if(isEmpty || minLengthError || emailError) {
                    setInputValid(false)
                }else {
                    setInputValid(true)
                }
            }, [isEmpty, minLengthError, emailError])
            
            return {
                isEmpty,
                minLengthError,
                emailError,
                inputValid
            }
        }
// Кастомный хук (содержит несколько хуков)
const useInput = (initialValue, validations) => {
    const [value, setValue] = useState(initialValue)
    const [bad, setBad] = useState(false)
    const valid = useValidation(value, validations)
// Обрабатывает изменения внутри inputа
    const onChange = (e) => {
        setValue(e.target.value)
    }
// Отрабатывает когда пользователь покинул inputа
    const onBlur = () => {
        setBad(true)
    }
// Заменяет содержимое inputa при клике на подсказку
    const handleBtn = (e) => {
        setValue(e.target.textContent)
    }
    return {
        value,
        onChange,
        onBlur,
        bad,
        handleBtn,
        ...valid
    }
}

const Login = () => {
    const hints = ['gmail.com', 'mail.ru', 'yahoo.com', 'example.com', 'rambler.ru'] 
    const [isSlide, setIsSlide] = useState(true)
    const email = useInput('', {isEmpty: true, minLength: 4, isEmail : true,})
    // Мне прилетали все данные, но меня заблокировали и я не могу зарегистрироваться снова и войти на старый акк. Не знаю почему.
    const AUTH_API = `https://api.kickbox.com/v2/verify?email=${email.value}&apikey=test_c6465cc71f08cfdfdd7bcc9bf91e132ecaddc44087dcaab64f2db56607f4c036`
    
    // Функция для фильтрации
    const checkHints = (inputHint, hint) => {
        const inpHint = inputHint.split(' ').join('');
        let result = 0;
        let count = 0;
        for(let i = 0 ; i < hint.length; i++){
            if(hint[i] === inpHint[count]){
                result++;
                count++;
            }
        }
        return inpHint.length === result;
    }

    async function kickboxAut () {
        let res = await axios.get(`${AUTH_API}`)
        console.log(res.data)
    }
    return (
        <div className='mainContent'>
            <h1>Авторизация</h1>
            {/*  Проверка на заполнение поля */}
            {(email.bad && email.isEmpty) && <div style={{color: 'black'}} >Поле не может быть пустым</div>}
            {/* Проверка на количество символов , должно быть больше 4-х */}
            {(email.bad && email.minLengthError) && <div style={{color: 'black'}} >Неккоректная длина</div>}
            {/* Проверка на корректность введённых данных */}
            {(email.bad && email.emailError) && <div style={{color: 'black'}} >Неккоректный емейл</div>}
            <TextField className='inp' onChange={e => email.onChange(e)} onBlur={e => email.onBlur(e)} value={email.value} name="email" type="text" placeholder="Enter your email" />
            {/* Проходим фильтром и перебираем показывая возможные варианты в виде Buttona */}
            <div>{(email.value.indexOf("@") !== -1) && hints.filter((elem) => {
                const inputHint = email.value.split("@")[1];
                return checkHints(inputHint, elem)
            }).map((elem, index) => {
                const name = email.value.split("@")[0];
                return <Button variant="contained" className="btnForChange" key={index} onClick={email.handleBtn}>{name.split(" ").join("") + "@" + elem}</Button>
            })}</div>
            <Button variant="contained" className='btn3' onClick={kickboxAut} disabled={!email.inputValid} type='submit'>Войти</Button>
        </div>
    );
};

export default Login;
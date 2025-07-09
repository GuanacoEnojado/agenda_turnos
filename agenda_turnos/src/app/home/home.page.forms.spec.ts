import { FormBuilder, FormGroup } from '@angular/forms';
import { LoginPageForm } from './home.page.forms';


describe('loginpageform', () => {

    let loginPageForm: LoginPageForm;
    let form : FormGroup

    beforeEach(()=>{
        loginPageForm = new LoginPageForm(new FormBuilder);
        form = loginPageForm.createForm();
    })

    it('should create login form empty', () => {
        

        expect(form).not.toBeNull();
        expect(form.get('email')).not.toBeNull();
        expect(form.get('email').value).toEqual('');
        expect(form.get('email').valid).toBeFalsy();
        expect(form.get('password')).not.toBeNull();
        expect(form.get('password').value).toEqual('');
        expect(form.get('password').valid).toBeFalsy();

    })

})
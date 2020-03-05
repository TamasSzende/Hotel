package com.progmasters.hotel.validator;

import com.progmasters.hotel.dto.HotelCreateItem;
import com.progmasters.hotel.service.HotelService;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

@Component
public class HotelCreateItemValidator implements Validator {

	private final HotelService validatorService;

	public HotelCreateItemValidator(HotelService validatorService) {
        this.validatorService = validatorService;
    }

	@Override
    public boolean supports(Class clazz) {
        return HotelCreateItem.class.equals(clazz);
    }

	@Override
    public void validate(Object obj, Errors e) {


		//TODO write the validations!!!


	}

}
